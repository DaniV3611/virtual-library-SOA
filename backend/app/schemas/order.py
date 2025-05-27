from datetime import datetime
import uuid
from decimal import Decimal
from pydantic import BaseModel


class OrderOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    total_amount: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class OrderDetails(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    total_amount: Decimal
    status: str
    created_at: datetime
    payment_id: str = None  # Optional payment ID for successful payments
    items: list[dict] = []

    class Config:
        from_attributes = True
