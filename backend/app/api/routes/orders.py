from typing import List
from fastapi import APIRouter, HTTPException, Request

from app.api.dependencies.deps import CurrentUserDep
from app.api.dependencies.session import SessionDep
from app.models.order import Order
from app.schemas.order import OrderDetails, OrderOut
from app.models.cart_item import CartItem
from app.models.order_item import OrderItem
from app.models.book import Book
from app.services.epayco import EpaycoService

router = APIRouter()

@router.get("/", response_model=List[OrderOut])
def get_orders(
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    Get all orders for the current user.
    """
    orders = session.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=OrderDetails)
def get_order_details(
    order_id: str,
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    Get details of a specific order.
    """
    order = session.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    items = session.query(OrderItem).filter(OrderItem.order_id == order.id).join(Book).where(OrderItem.book_id == Book.id).all()

    
    return {
        "id": order.id,
        "user_id": order.user_id,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "items": [
            {
                "book_id": item.book_id,
                "book_title": item.book.title,
                "book_author": item.book.author,
                "book_description": item.book.description,
                "book_image": item.book.cover_url,
                "book_file": item.book.file_url,
                "quantity": item.quantity,
                "price": item.price
            } for item in items
        ]
    }


@router.post("/", response_model=OrderOut)
def create_order(
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    Create a new order from the user's shopping cart.
    """
    # Obtener el carrito del usuario
    cart_items = session.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()
    
    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="El carrito está vacío"
        )
    
    # Calcular el total del pedido
    total_amount = sum(item.quantity * item.book.price for item in cart_items)
    
    # Crear la orden
    order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="created"
    )
    session.add(order)
    session.flush()  # Para obtener el ID de la orden
    
    # Crear los items de la orden
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            book_id=cart_item.book_id,
            quantity=cart_item.quantity,
            price=cart_item.book.price
        )
        session.add(order_item)
        
        # Eliminar el item del carrito
        session.delete(cart_item)
    
    session.commit()
    session.refresh(order)
    
    return order

@router.post("/{order_id}/pay", response_model=OrderDetails)
async def pay_order(
    order_id: str,
    request: Request,
    session: SessionDep,
    current_user: CurrentUserDep,
):
    
    # data = {
    #     # Credit info
    #     "card[number]": "4575623182290326",
    #     "card[exp_year]": "2025",
    #     "card[exp_month]": "19",
    #     "card[cvc]": "123",
    #     "hasCvv": True,

    #     # Client info
    #     "name": "Joe",
    #     "last_name": "Doe", #This parameter is optional
    #     "email": "joe@payco.co",
    #     "phone": "3005234321",
    #     "city": "Bogota",
    #     "address": "Cr 4 # 55 36",
    #     "phone": "3005234321",
    #     "cell_phone": "3010000001",
    #     "identification": "123456789",
    #     "amount": "10000",
    #     "dues": "1",
    # }

    """
    Process payment for an order.
    """
    order = session.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    data = await request.json()

    print(data)
    
    client_ip = request.client.host

    epayco = EpaycoService()

    token = epayco.get_token({
        "card[number]": data["card[number]"],
        "card[exp_year]": data["card[exp_year]"],
        "card[exp_month]": data["card[exp_month]"],
        "card[cvc]": data["card[cvc]"],
        "hasCvv": True
    })

    if not token["status"]:
        raise HTTPException(status_code=422, detail="Invalid credit info")
    
    client_epayco = epayco.create_client({
        "token_card": token.get("id"),
        "name": data["name"],
        "last_name": data["last_name"],
        "email": data["email"],
        "phone": data["phone"],
        "default": True,
        "city": data["city"],
        "address": data["address"],
        "cell_phone": data["cell_phone"]
    })

    if not client_epayco["status"]:
        raise HTTPException(status_code=422, detail="Failed to create ePayco client")

    # print("Client:", client_epayco)

    client_id = client_epayco["data"]["customerId"]

    # print("Cliente id", client_id)

    payment_epayco = epayco.charge(
        token_card=token.get("id"),
        customer_id=client_id,
        client={
            "identification": data["identification"],
            "full_name": f"{data['name']} {data['last_name']}",
            "email": data["email"],
        },
        amount=data["amount"],
        bill=order.id,
        client_ip=client_ip
    )


    if payment_epayco["status"] and payment_epayco["success"]:
        # Update payment status based on ePayco response
        # See https://docs.epayco.com/docs/paginas-de-respuestas
        if payment_epayco["data"]["cod_respuesta"] == 1:
            # Payment was successful
            order.status = "completed"
        elif payment_epayco["data"]["cod_respuesta"] == 2:
            order.status = "rejected"
        elif payment_epayco["data"]["cod_respuesta"] == 3:
            order.status = "pending"
        elif payment_epayco["data"]["cod_respuesta"] == 4:
            order.status = "failed"
        elif payment_epayco["data"]["cod_respuesta"] == 6:
            order.status = "reversed"
        elif payment_epayco["data"]["cod_respuesta"] == 7:
            order.status = "retained"
        elif payment_epayco["data"]["cod_respuesta"] == 8:
            order.status = "started"
        elif payment_epayco["data"]["cod_respuesta"] == 9:
            order.status = "expired"
        elif payment_epayco["data"]["cod_respuesta"] == 10:
            order.status = "abandoned"
        elif payment_epayco["data"]["cod_respuesta"] == 11:
            order.status = "canceled"


        print(f"Processing payment for order {order_id} from IP {client_ip}")
        
        session.commit()


        # Get order details
        items = session.query(OrderItem).filter(OrderItem.order_id == order.id).join(Book).where(OrderItem.book_id == Book.id).all()

        return {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "book_id": item.book_id,
                    "book_title": item.book.title,
                    "book_author": item.book.author,
                    "book_description": item.book.description,
                    "book_image": item.book.cover_url,
                    "book_file": item.book.file_url,
                    "quantity": item.quantity,
                    "price": item.price
                } for item in items
            ]
        }
    
    else:
        raise HTTPException(status_code=422, detail="Payment failed")
