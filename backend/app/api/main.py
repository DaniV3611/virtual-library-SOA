from fastapi import APIRouter

from app.api.routes import books
from app.api.routes import users
from app.api.routes import categories


api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
