from typing import List
from fastapi import APIRouter, HTTPException

from app.api.dependencies.deps import CurrentUserDep
from app.api.dependencies.session import SessionDep
from app.models.order import Order
from app.schemas.order import OrderDetails, OrderOut
from app.models.cart_item import CartItem
from app.models.order_item import OrderItem
from app.models.book import Book

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
