from typing import List
from app.api.dependencies.session import SessionDep
from app.models.book import Book
from app.schemas.book import BookCreate


def get_all_books(session: SessionDep) -> List[Book]:
    books = session.query(Book).all()
    return books

def create_book_db(session: SessionDep, book: BookCreate) -> Book:
    db_book = Book(**book.dict())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

def get_book_by_id(session: SessionDep, book_id: str) -> Book | None:
    book = session.query(Book).filter(Book.id == book_id).first()
    return book
