from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from app.models.user_hidden_book import UserHiddenBook
from app.schemas.user_hidden_book import UserHiddenBookCreate


def hide_book_for_user(session: Session, user_id: uuid.UUID, book_id: uuid.UUID) -> Optional[UserHiddenBook]:
    """Hide a book for a specific user"""
    # Check if already hidden
    existing = session.query(UserHiddenBook).filter(
        UserHiddenBook.user_id == user_id,
        UserHiddenBook.book_id == book_id
    ).first()
    
    if existing:
        return existing
    
    # Create new hidden book record
    hidden_book = UserHiddenBook(
        user_id=user_id,
        book_id=book_id
    )
    session.add(hidden_book)
    session.commit()
    session.refresh(hidden_book)
    return hidden_book


def unhide_book_for_user(session: Session, user_id: uuid.UUID, book_id: uuid.UUID) -> bool:
    """Unhide a book for a specific user"""
    hidden_book = session.query(UserHiddenBook).filter(
        UserHiddenBook.user_id == user_id,
        UserHiddenBook.book_id == book_id
    ).first()
    
    if hidden_book:
        session.delete(hidden_book)
        session.commit()
        return True
    return False


def get_hidden_books_for_user(session: Session, user_id: uuid.UUID) -> List[uuid.UUID]:
    """Get list of hidden book IDs for a user"""
    hidden_books = session.query(UserHiddenBook.book_id).filter(
        UserHiddenBook.user_id == user_id
    ).all()
    
    return [book.book_id for book in hidden_books]


def is_book_hidden_for_user(session: Session, user_id: uuid.UUID, book_id: uuid.UUID) -> bool:
    """Check if a book is hidden for a specific user"""
    hidden_book = session.query(UserHiddenBook).filter(
        UserHiddenBook.user_id == user_id,
        UserHiddenBook.book_id == book_id
    ).first()
    
    return hidden_book is not None


def count_hidden_books_for_user(session: Session, user_id: uuid.UUID) -> int:
    """Count hidden books for a user"""
    return session.query(UserHiddenBook).filter(
        UserHiddenBook.user_id == user_id
    ).count()


def toggle_book_visibility_for_user(session: Session, user_id: uuid.UUID, book_id: uuid.UUID, hide: bool) -> bool:
    """Toggle book visibility for a user"""
    if hide:
        result = hide_book_for_user(session, user_id, book_id)
        return result is not None
    else:
        return unhide_book_for_user(session, user_id, book_id) 