from typing import List
from app.api.dependencies.session import SessionDep
from app.models.book import Book
from app.schemas.book import BookCreate
from sqlalchemy import func, desc

from app.models.order import Order
from app.models.order_item import OrderItem


def get_all_books(session: SessionDep) -> List[Book]:
    books = session.query(Book).all()
    return books

def create_book_db(session: SessionDep, book: BookCreate) -> Book:
    book.sanitize()  # Desinfección de entradas
    db_book = Book(**book.dict())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def get_book_by_id(session: SessionDep, book_id: str) -> Book | None:
    book = session.query(Book).filter(Book.id == book_id).first()
    return book

def update_book_db(session: SessionDep, book_id: str, book_data: dict) -> Book | None:
    # Sanitizar los campos de texto si existen
    for key in ["title", "author", "description", "cover_url", "file_url"]:
        if key in book_data and isinstance(book_data[key], str):
            from app.utils.security_validations import sanitize_input
            book_data[key] = sanitize_input(book_data[key])
    book = get_book_by_id(session, book_id)
    if not book:
        return None
    
    for key, value in book_data.items():
        setattr(book, key, value)
    
    session.commit()
    session.refresh(book)
    return book

def delete_book_db(session: SessionDep, book_id: str) -> bool:
    book = get_book_by_id(session, book_id)
    if not book:
        return False
    
    session.delete(book)
    session.commit()
    return True

def get_most_purchased_books(session: SessionDep, limit: int = 3) -> List[Book]:
    """
    Get the most purchased books based on order items count
    """
    books = session.query(
        Book,
        func.count(OrderItem.id).label('purchase_count')
    ).join(
        OrderItem,
        Book.id == OrderItem.book_id
    ).join(
        Order,
        OrderItem.order_id == Order.id
    ).filter(
        Order.status == "completed"
    ).group_by(
        Book.id
    ).order_by(
        desc('purchase_count')
    ).limit(limit).all()
    
    return [book[0] for book in books]

def get_latest_books(session: SessionDep, limit: int = 3) -> List[Book]:
    """
    Get the most recently created books
    """
    books = session.query(Book).order_by(
        desc(Book.created_at)
    ).limit(limit).all()
    
    return books
