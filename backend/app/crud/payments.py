from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.payment import Payment
from app.models.order import Order
from app.schemas.payment import PaymentCreate, PaymentWithOrder

def create_payment(session: Session, payment_data: PaymentCreate) -> Payment:
    """Create a new payment record"""
    payment = Payment(**payment_data.model_dump())
    session.add(payment)
    session.commit()
    session.refresh(payment)
    return payment

def get_payment_by_id(session: Session, payment_id: str) -> Optional[Payment]:
    """Get payment by ID"""
    return session.query(Payment).filter(Payment.id == payment_id).first()

def get_payments_by_user_id(
    session: Session, 
    user_id: str, 
    skip: int = 0, 
    limit: int = 100
) -> List[PaymentWithOrder]:
    """Get all payments for a specific user with order information"""
    payments_query = (
        session.query(Payment, Order)
        .join(Order, Payment.order_id == Order.id)
        .filter(Order.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    
    payments_with_orders = []
    for payment, order in payments_query:
        payment_with_order = PaymentWithOrder(
            # Payment fields
            id=payment.id,
            order_id=payment.order_id,
            amount=payment.amount,
            status=payment.status,
            payment_method=payment.payment_method,
            epayco_transaction_id=payment.epayco_transaction_id,
            epayco_response_code=payment.epayco_response_code,
            epayco_response_message=payment.epayco_response_message,
            epayco_approval_code=payment.epayco_approval_code,
            epayco_receipt=payment.epayco_receipt,
            card_last_four=payment.card_last_four,
            card_brand=payment.card_brand,
            client_name=payment.client_name,
            client_email=payment.client_email,
            client_phone=payment.client_phone,
            client_ip=str(payment.client_ip) if payment.client_ip else None,
            created_at=payment.created_at,
            processed_at=payment.processed_at,
            updated_at=payment.updated_at,
            # Order fields
            order_total=order.total_amount,
            order_status=order.status,
            order_created_at=order.created_at
        )
        payments_with_orders.append(payment_with_order)
    
    return payments_with_orders

def count_payments_by_user_id(session: Session, user_id: str) -> int:
    """Count total payments for a user"""
    return (
        session.query(Payment)
        .join(Order, Payment.order_id == Order.id)
        .filter(Order.user_id == user_id)
        .count()
    )

def get_payments_by_order_id(session: Session, order_id: str) -> List[Payment]:
    """Get all payments for a specific order"""
    return session.query(Payment).filter(Payment.order_id == order_id).all()

def update_payment_status(
    session: Session, 
    payment_id: str, 
    status: str,
    epayco_data: dict = None
) -> Optional[Payment]:
    """Update payment status and ePayco information"""
    payment = session.query(Payment).filter(Payment.id == payment_id).first()
    if payment:
        payment.status = status
        payment.updated_at = datetime.utcnow()
        
        if status in ["completed", "failed", "rejected"]:
            payment.processed_at = datetime.utcnow()
        
        # Update ePayco data if provided
        if epayco_data:
            if "transaction_id" in epayco_data:
                payment.epayco_transaction_id = epayco_data["transaction_id"]
            if "response_code" in epayco_data:
                payment.epayco_response_code = epayco_data["response_code"]
            if "response_message" in epayco_data:
                payment.epayco_response_message = epayco_data["response_message"]
            if "approval_code" in epayco_data:
                payment.epayco_approval_code = epayco_data["approval_code"]
            if "receipt" in epayco_data:
                payment.epayco_receipt = epayco_data["receipt"]
        
        session.commit()
        session.refresh(payment)
    return payment

def get_all_payments_with_order_info(
    session: Session, 
    skip: int = 0, 
    limit: int = 100
) -> List[PaymentWithOrder]:
    """Get all payments in the system with order information (for admin use)"""
    payments_query = (
        session.query(Payment, Order)
        .join(Order, Payment.order_id == Order.id)
        .filter(Payment.status == "completed")
        .order_by(Payment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    
    payments_with_orders = []
    for payment, order in payments_query:
        payment_with_order = PaymentWithOrder(
            # Payment fields
            id=payment.id,
            order_id=payment.order_id,
            amount=payment.amount,
            status=payment.status,
            payment_method=payment.payment_method,
            epayco_transaction_id=payment.epayco_transaction_id,
            epayco_response_code=payment.epayco_response_code,
            epayco_response_message=payment.epayco_response_message,
            epayco_approval_code=payment.epayco_approval_code,
            epayco_receipt=payment.epayco_receipt,
            card_last_four=payment.card_last_four,
            card_brand=payment.card_brand,
            client_name=payment.client_name,
            client_email=payment.client_email,
            client_phone=payment.client_phone,
            client_ip=str(payment.client_ip) if payment.client_ip else None,
            created_at=payment.created_at,
            processed_at=payment.processed_at,
            updated_at=payment.updated_at,
            # Order fields
            order_total=order.total_amount,
            order_status=order.status,
            order_created_at=order.created_at
        )
        payments_with_orders.append(payment_with_order)
    
    return payments_with_orders

def count_all_payments(session: Session) -> int:
    """Count total payments in the system (for admin use)"""
    return session.query(Payment).filter(Payment.status == "completed").count() 