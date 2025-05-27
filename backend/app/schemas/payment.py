from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID

class PaymentBase(BaseModel):
    amount: Decimal
    status: str
    payment_method: Optional[str] = "credit_card"
    
class PaymentCreate(PaymentBase):
    order_id: UUID
    # ePayco information
    epayco_transaction_id: Optional[str] = None
    epayco_response_code: Optional[int] = None
    epayco_response_message: Optional[str] = None
    epayco_approval_code: Optional[str] = None
    epayco_receipt: Optional[str] = None
    
    # Payment method information
    card_last_four: Optional[str] = None
    card_brand: Optional[str] = None
    
    # Client information
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    client_ip: Optional[str] = None
    
    processed_at: Optional[datetime] = None

class PaymentOut(PaymentBase):
    id: UUID
    order_id: UUID
    
    # ePayco information
    epayco_transaction_id: Optional[str] = None
    epayco_response_code: Optional[int] = None
    epayco_response_message: Optional[str] = None
    epayco_approval_code: Optional[str] = None
    epayco_receipt: Optional[str] = None
    
    # Payment method information
    card_last_four: Optional[str] = None
    card_brand: Optional[str] = None
    
    # Client information
    client_name: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None
    client_ip: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    processed_at: Optional[datetime] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class PaymentWithOrder(PaymentOut):
    """Payment with basic order information"""
    order_total: Decimal
    order_status: str
    order_created_at: datetime

class PaymentsResponse(BaseModel):
    payments: List[PaymentWithOrder]
    total: int 