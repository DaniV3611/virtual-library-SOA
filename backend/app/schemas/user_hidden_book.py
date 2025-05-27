import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import List


class UserHiddenBookCreate(BaseModel):
    """Schema for hiding a book"""
    book_id: uuid.UUID


class UserHiddenBookOut(BaseModel):
    """Schema for hidden book response"""
    id: uuid.UUID
    user_id: uuid.UUID
    book_id: uuid.UUID
    hidden_at: datetime

    class Config:
        from_attributes = True


class HiddenBooksResponse(BaseModel):
    """Schema for listing hidden books"""
    hidden_books: List[uuid.UUID]
    total: int


class ToggleBookVisibilityRequest(BaseModel):
    """Schema for toggling book visibility"""
    book_id: uuid.UUID
    hide: bool  # True to hide, False to unhide 