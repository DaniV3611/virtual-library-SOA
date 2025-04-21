from fastapi import APIRouter, HTTPException
from typing import List
from fastapi import status

from app.api.dependencies.session import SessionDep
from app.schemas.book import BookCreate, BookOut
from app.crud.books import create_book_db, get_all_books, get_book_by_id
from app.api.dependencies.deps import CurrentUserDep, UserIsAdminDep
from app.models.book import Book
from app.models.order import Order
from app.models.order_item import OrderItem


router = APIRouter()

@router.get("/", response_model=List[BookOut])
def get_books(session: SessionDep):
    books = get_all_books(session)
    return books

@router.post("/", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(book: BookCreate, session: SessionDep, current_user: UserIsAdminDep):
    db_book = create_book_db(session, book)
    return db_book

@router.get("/purchased", response_model=List[BookOut])
def get_user_purchased_books(session: SessionDep, current_user: CurrentUserDep):
    """
    Get all purchased books for the current user.
    """
    purchased_books = session.query(Book).join(OrderItem).join(Order).filter(
        Order.user_id == current_user.id,
        Order.status == "completed"
    ).all()

    return purchased_books

@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: str, session: SessionDep):
    book = get_book_by_id(session, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book
