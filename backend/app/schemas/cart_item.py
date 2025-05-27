import uuid
from pydantic import BaseModel

from app.schemas.book import BookOut


class CartItemCreate(BaseModel):
    book_id: uuid.UUID
    quantity: int = 1

class CartItemOut(BaseModel):
    id: uuid.UUID
    book: BookOut
    quantity: int = 1

    class Config:
        from_attributes = True
