from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request, Query

from app.api.dependencies.deps import CurrentUserDep
from app.api.dependencies.session import SessionDep
from app.models.order import Order
from app.models.payment import Payment
from app.schemas.order import OrderDetails, OrderOut
from app.schemas.payment import PaymentCreate, PaymentsResponse
from app.models.cart_item import CartItem
from app.models.order_item import OrderItem
from app.models.book import Book
from app.models.user import User
from app.services.epayco import EpaycoService
from app.services.notificaciones import noificaciones
from app.crud.payments import create_payment, get_payments_by_user_id, count_payments_by_user_id, get_all_payments_with_order_info, count_all_payments

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

@router.get("/payments", response_model=PaymentsResponse)
def get_user_payments(
    session: SessionDep,
    current_user: CurrentUserDep,
    skip: int = Query(0, ge=0, description="Number of payments to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of payments to return")
) -> PaymentsResponse:
    """
    Get all payments for the current user with order information.
    If user is admin, returns all payments in the system.
    """
    if current_user.role == "admin":
        # Admin can see all payments
        payments = get_all_payments_with_order_info(session, skip=skip, limit=limit)
        total = count_all_payments(session)
    else:
        # Regular users see only their own payments
        payments = get_payments_by_user_id(
            session, 
            user_id=current_user.id,
            skip=skip,
            limit=limit
        )
        total = count_payments_by_user_id(session, user_id=current_user.id)
    
    return PaymentsResponse(
        payments=payments,
        total=total
    )

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
    # Get user's shopping cart
    cart_items = session.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).all()
    
    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Shopping cart is empty"
        )
    
    # Calculate order total
    total_amount = sum(item.quantity * item.book.price for item in cart_items)
    
    # Create the order
    order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="created"
    )
    session.add(order)
    session.flush()  # To get the order ID
    
    # Create order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            book_id=cart_item.book_id,
            quantity=cart_item.quantity,
            price=cart_item.book.price
        )
        session.add(order_item)
        
        # Remove item from cart
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
    """
    Process payment for an order using simplified payment data.
    User information is taken from the authenticated user.
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
    
    # Split user name into first and last name
    user_name_parts = current_user.name.split(' ', 1)
    first_name = user_name_parts[0]
    last_name = user_name_parts[1] if len(user_name_parts) > 1 else ""
    
    client_epayco = epayco.create_client({
        "token_card": token.get("id"),
        "name": first_name,
        "last_name": last_name,
        "email": current_user.email,  # Use authenticated user's email
        "phone": data["phone"],
        "default": True,
        "city": data.get("city", "Unknown"),  # Make city optional with default
        "address": data.get("address", "N/A"),  # Make address optional with default
        "cell_phone": data["phone"]  # Use same phone for both fields
    })

    if not client_epayco["status"]:
        raise HTTPException(status_code=422, detail="Failed to create ePayco client")

    client_id = client_epayco["data"]["customerId"]

    payment_epayco = epayco.charge(
        token_card=token.get("id"),
        customer_id=client_id,
        client={
            "identification": data["identification"],
            "full_name": current_user.name,  # Use full name from user model
            "email": current_user.email,  # Use authenticated user's email
        },
        amount=data["amount"],
        bill=order.id,
        client_ip=client_ip
    )

    # Extract card information for storage (last 4 digits only for security)
    card_number = data.get("card[number]", "")
    card_last_four = card_number[-4:] if len(card_number) >= 4 else None
    
    # Determine card brand based on first digit (simplified)
    card_brand = None
    if card_number:
        first_digit = card_number[0]
        if first_digit == "4":
            card_brand = "Visa"
        elif first_digit == "5":
            card_brand = "Mastercard"
        elif first_digit == "3":
            card_brand = "American Express"
    
    if payment_epayco["status"] and payment_epayco["success"]:
        # Determine payment status based on ePayco response
        epayco_response_code = payment_epayco["data"]["cod_respuesta"]
        payment_status = "pending"  # default
        
        if epayco_response_code == 1:
            payment_status = "completed"
            order.status = "completed"
        elif epayco_response_code == 2:
            payment_status = "rejected"
            order.status = "rejected"
        elif epayco_response_code == 3:
            payment_status = "pending"
            order.status = "pending"
        elif epayco_response_code == 4:
            payment_status = "failed"
            order.status = "failed"
        elif epayco_response_code == 6:
            payment_status = "reversed"
            order.status = "reversed"
        elif epayco_response_code == 7:
            payment_status = "retained"
            order.status = "retained"
        elif epayco_response_code == 8:
            payment_status = "started"
            order.status = "started"
        elif epayco_response_code == 9:
            payment_status = "expired"
            order.status = "expired"
        elif epayco_response_code == 10:
            payment_status = "abandoned"
            order.status = "abandoned"
        elif epayco_response_code == 11:
            payment_status = "canceled"
            order.status = "canceled"

        # Create payment record using user information
        payment_data = PaymentCreate(
            order_id=order.id,
            amount=order.total_amount,
            status=payment_status,
            payment_method="credit_card",
            
            # ePayco information - convert to strings to handle integer responses
            epayco_transaction_id=str(payment_epayco["data"].get("ref_payco")) if payment_epayco["data"].get("ref_payco") is not None else None,
            epayco_response_code=epayco_response_code,
            epayco_response_message=str(payment_epayco["data"].get("respuesta")) if payment_epayco["data"].get("respuesta") is not None else None,
            epayco_approval_code=str(payment_epayco["data"].get("cod_autorizacion")) if payment_epayco["data"].get("cod_autorizacion") is not None else None,
            epayco_receipt=str(payment_epayco["data"].get("recibo")) if payment_epayco["data"].get("recibo") is not None else None,
            
            # Card information (secure)
            card_last_four=card_last_four,
            card_brand=card_brand,
            
            # Client information from authenticated user
            client_name=current_user.name,
            client_email=current_user.email,
            client_phone=data.get("phone"),
            client_ip=client_ip,
            
            processed_at=datetime.utcnow()
        )
        
        # Save payment record
        payment_record = create_payment(session, payment_data)
        
        print(f"Payment created with ID: {payment_record.id} for order {order_id} from IP {client_ip}")
        
        # Update order status
        session.commit()

        # Get order details
        items = session.query(OrderItem).filter(OrderItem.order_id == order.id).join(Book).where(OrderItem.book_id == Book.id).all()

        # Send invoice notification if payment was successful
        try:
            notification_service = noificaciones()
            await notification_service.send_invoice_html_notification(
                order=order,
                payment=payment_record,
                user=current_user,
                order_items=items
            )
        except Exception as e:
            print(f"Error sending invoice email: {e}")
            # Don't interrupt the flow if email sending fails

        return {
            "id": order.id,
            "user_id": order.user_id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "payment_id": str(payment_record.id),  # Include payment ID for frontend navigation
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
        # Payment failed - still record the attempt
        payment_data = PaymentCreate(
            order_id=order.id,
            amount=order.total_amount,
            status="failed",
            payment_method="credit_card",
            
            # ePayco information (if available) - convert to string
            epayco_response_message=str(payment_epayco.get("data", {}).get("respuesta", "Payment failed")),
            
            # Card information (secure)
            card_last_four=card_last_four,
            card_brand=card_brand,
            
            # Client information from authenticated user
            client_name=current_user.name,
            client_email=current_user.email,
            client_phone=data.get("phone"),
            client_ip=client_ip,
            
            processed_at=datetime.utcnow()
        )
        
        # Save failed payment record
        payment_record = create_payment(session, payment_data)
        print(f"Failed payment recorded with ID: {payment_record.id} for order {order_id}")
        
        raise HTTPException(status_code=422, detail="Payment failed")
