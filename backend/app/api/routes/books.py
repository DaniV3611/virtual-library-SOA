from fastapi import APIRouter, HTTPException
from typing import List
from fastapi import status

from app.api.dependencies.session import SessionDep
from app.schemas.book import BookCreate, BookOut
from app.crud.books import (
    create_book_db, 
    get_all_books, 
    get_book_by_id,
    update_book_db,
    delete_book_db,
    get_most_purchased_books,
    get_latest_books
)
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

@router.get("/most-purchased", response_model=List[BookOut])
def get_most_purchased_books_route(session: SessionDep):
    """
    Get the 3 most purchased books
    """
    books = get_most_purchased_books(session)
    return books

@router.get("/latest", response_model=List[BookOut])
def get_latest_books_route(session: SessionDep):
    """
    Get the 3 most recently created books
    """
    books = get_latest_books(session)
    return books

@router.get("/{book_id}", response_model=BookOut)
def get_book(book_id: str, session: SessionDep):
    book = get_book_by_id(session, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.put("/{book_id}", response_model=BookOut)
def update_book(
    book_id: str,
    book_data: BookCreate,
    session: SessionDep,
    current_user: UserIsAdminDep
):
    """
    Update a book by ID (admin only)
    """
    updated_book = update_book_db(session, book_id, book_data.dict(exclude_unset=True))
    if not updated_book:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: str,
    session: SessionDep,
    current_user: UserIsAdminDep
):
    """
    Delete a book by ID (admin only)
    """
    success = delete_book_db(session, book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return None

