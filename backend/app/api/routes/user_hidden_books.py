from typing import List
from fastapi import APIRouter, HTTPException, status, Query
from app.api.dependencies.session import SessionDep
from app.api.dependencies.deps import CurrentUserDep
from app.schemas.user_hidden_book import (
    ToggleBookVisibilityRequest,
    HiddenBooksResponse,
    UserHiddenBookOut
)
from app.schemas.book import BookOut, PurchasedBookOut
from app.crud.user_hidden_books import (
    toggle_book_visibility_for_user,
    get_hidden_books_for_user,
    count_hidden_books_for_user
)
from app.crud.books import get_hidden_books_for_user as get_hidden_book_objects

router = APIRouter()


@router.post("/toggle-visibility", response_model=dict)
def toggle_book_visibility(
    request: ToggleBookVisibilityRequest,
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    Toggle visibility of a book for the current user
    """
    success = toggle_book_visibility_for_user(
        session, 
        current_user.id, 
        request.book_id, 
        request.hide
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update book visibility"
        )
    
    action = "hidden" if request.hide else "unhidden"
    return {
        "message": f"Book successfully {action}",
        "book_id": str(request.book_id),
        "hidden": request.hide
    }


@router.get("/hidden-books", response_model=HiddenBooksResponse)
def get_user_hidden_books(
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    Get list of hidden book IDs for the current user
    """
    hidden_book_ids = get_hidden_books_for_user(session, current_user.id)
    total = count_hidden_books_for_user(session, current_user.id)
    
    return HiddenBooksResponse(
        hidden_books=hidden_book_ids,
        total=total
    )


@router.get("/hidden-books/details", response_model=List[PurchasedBookOut])
def get_user_hidden_books_details(
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    Get detailed information of hidden purchased books for the current user
    """
    from app.models.user_hidden_book import UserHiddenBook
    from app.models.order import Order
    from app.models.order_item import OrderItem
    from app.models.book import Book
    
    # Query to get hidden books that were purchased by the user
    hidden_purchased_books_data = session.query(
        Book.id,
        Book.title,
        Book.author,
        Book.description,
        Book.cover_url,
        Book.file_url,
        Order.id.label('order_id'),
        Order.created_at.label('purchased_at')
    ).join(UserHiddenBook, Book.id == UserHiddenBook.book_id)\
     .join(OrderItem, Book.id == OrderItem.book_id)\
     .join(Order, OrderItem.order_id == Order.id)\
     .filter(
        UserHiddenBook.user_id == current_user.id,
        Order.user_id == current_user.id,
        Order.status == "completed"
    ).all()

    # Convert to list of dictionaries for the response model
    hidden_books = []
    for book_data in hidden_purchased_books_data:
        hidden_books.append({
            "id": book_data.id,
            "title": book_data.title,
            "author": book_data.author,
            "description": book_data.description,
            "cover_url": book_data.cover_url,
            "file_url": book_data.file_url,
            "order_id": book_data.order_id,
            "purchased_at": book_data.purchased_at
        })

    return hidden_books 