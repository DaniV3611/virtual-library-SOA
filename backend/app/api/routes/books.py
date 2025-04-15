from fastapi import APIRouter
from typing import List
from fastapi import status

from app.api.dependencies import SessionDep
from app.models.book import Book
from app.schemas.book import BookCreate, BookOut


router = APIRouter()

@router.get("/", response_model=List[BookOut])
def get_books(session: SessionDep):
    books = session.query(Book).all()
    return books

@router.post("/", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(book: BookCreate, session: SessionDep):
    db_book = Book(**book.dict())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book
