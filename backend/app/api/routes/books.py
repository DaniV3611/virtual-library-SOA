from fastapi import APIRouter, HTTPException, Query
from typing import List
from fastapi import status

from app.api.dependencies.session import SessionDep
from app.schemas.book import BookCreate, BookOut, PurchasedBookOut
from app.crud.books import (
    create_book_db, 
    get_all_books, 
    get_visible_books_for_user,
    get_book_by_id,
    update_book_db,
    delete_book_db,
    get_most_purchased_books,
    get_latest_books
)
from app.api.dependencies.deps import CurrentUserDep, UserIsAdminDep, OptionalCurrentUserDep
from app.models.book import Book
from app.models.order import Order
from app.models.order_item import OrderItem


router = APIRouter()

@router.get("/", response_model=List[BookOut])
def get_books(
    session: SessionDep,
    current_user: OptionalCurrentUserDep,
    include_hidden: bool = Query(False, description="Include books hidden by the user")
):
    """Get all books, optionally filtering out hidden books for the current user"""
    if current_user and not include_hidden:
        books = get_visible_books_for_user(session, current_user.id)
    else:
        books = get_all_books(session)
    return books

@router.post("/", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(book: BookCreate, session: SessionDep, current_user: UserIsAdminDep):
    db_book = create_book_db(session, book)
    return db_book

@router.get("/purchased", response_model=List[PurchasedBookOut])
def get_user_purchased_books(session: SessionDep, current_user: CurrentUserDep):
    """
    Get all purchased books for the current user with order information, excluding hidden books.
    """
    from app.models.user_hidden_book import UserHiddenBook
    
    # Query to get books with order information, excluding hidden books
    purchased_books_data = session.query(
        Book.id,
        Book.title,
        Book.author,
        Book.description,
        Book.cover_url,
        Book.file_url,
        Order.id.label('order_id'),
        Order.created_at.label('purchased_at')
    ).join(OrderItem, Book.id == OrderItem.book_id)\
     .join(Order, OrderItem.order_id == Order.id)\
     .outerjoin(UserHiddenBook, 
                (UserHiddenBook.book_id == Book.id) & 
                (UserHiddenBook.user_id == current_user.id))\
     .filter(
        Order.user_id == current_user.id,
        Order.status == "completed",
        UserHiddenBook.id.is_(None)  # Exclude hidden books
    ).all()

    # Convert to list of dictionaries for the response model
    purchased_books = []
    for book_data in purchased_books_data:
        purchased_books.append({
            "id": book_data.id,
            "title": book_data.title,
            "author": book_data.author,
            "description": book_data.description,
            "cover_url": book_data.cover_url,
            "file_url": book_data.file_url,
            "order_id": book_data.order_id,
            "purchased_at": book_data.purchased_at
        })

    return purchased_books

@router.get("/most-purchased", response_model=List[BookOut])
def get_most_purchased_books_route(
    session: SessionDep,
    current_user: OptionalCurrentUserDep
):
    """
    Get the 3 most purchased books, excluding hidden books for the current user
    """
    user_id = current_user.id if current_user else None
    books = get_most_purchased_books(session, user_id)
    return books

@router.get("/latest", response_model=List[BookOut])
def get_latest_books_route(
    session: SessionDep,
    current_user: OptionalCurrentUserDep
):
    """
    Get the 3 most recently created books, excluding hidden books for the current user
    """
    user_id = current_user.id if current_user else None
    books = get_latest_books(session, user_id)
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

