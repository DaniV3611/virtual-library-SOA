# Book out schema
import uuid
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.utils.security_validations import sanitize_input


class BookOut(BaseModel):
    
    id: uuid.UUID
    title: str
    author: str
    description: str
    cover_url: Optional[str] = None
    price: float
    category_id: Optional[uuid.UUID] = None
    file_url: Optional[str] = None

    class Config:
        from_attributes = True

class PurchasedBookOut(BaseModel):
    """Schema for purchased books with order information"""
    
    id: uuid.UUID
    title: str
    author: str
    description: str
    cover_url: Optional[str] = None
    file_url: Optional[str] = None
    order_id: uuid.UUID
    purchased_at: datetime

    class Config:
        from_attributes = True

class BookCreate(BaseModel):

    title: str
    author: str
    cover_url: Optional[str] = None
    description: str
    price: float
    category_id: Optional[uuid.UUID] = None
    file_url: Optional[str] = None

    def sanitize(self):
        self.title = sanitize_input(self.title)
        self.author = sanitize_input(self.author)
        if self.cover_url:
            self.cover_url = sanitize_input(self.cover_url)
        self.description = sanitize_input(self.description)
        if self.file_url:
            self.file_url = sanitize_input(self.file_url)
