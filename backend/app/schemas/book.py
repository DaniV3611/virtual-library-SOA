# Book out schema
import uuid
from typing import Optional
from pydantic import BaseModel


class BookOut(BaseModel):
    
    id: uuid.UUID
    title: str
    author: str
    description: str
    cover_url: Optional[str] = None
    price: float
    category_id: Optional[uuid.UUID] = None

    class Config:
        orm_mode = True

class BookCreate(BaseModel):

    title: str
    author: str
    cover_url: Optional[str] = None
    description: str
    price: float
    category_id: Optional[uuid.UUID] = None
