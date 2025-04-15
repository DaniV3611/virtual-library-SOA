# Book out schema
import uuid
from typing import Optional
from pydantic import BaseModel


class BookOut(BaseModel):
    id: uuid.UUID
    title: str
    author: str
    cover_url: Optional[str] = None

    class Config:
        orm_mode = True
