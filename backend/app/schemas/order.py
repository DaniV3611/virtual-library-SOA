from datetime import datetime
import uuid
from pydantic import BaseModel


class OrderOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    total_amount: float
    status: str
    created_at: datetime

class OrderDetails(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    total_amount: float
    status: str
    created_at: datetime
    items: list[dict] = []
