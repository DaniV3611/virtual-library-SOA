from fastapi import APIRouter
from typing import List

from app.api.dependencies import SessionDep
from app.models.book import Book
from app.schemas.book import BookOut


router = APIRouter()

@router.get("/", response_model=List[BookOut])
def get_books(session: SessionDep):
    books = session.query(Book).all()
    return books
