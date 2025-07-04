from fastapi import APIRouter

from app.api.routes import books
from app.api.routes import users
from app.api.routes import categories
from app.api.routes import cart
from app.api.routes import orders
from app.api.routes import files
from app.api.routes import user_hidden_books
from app.api.routes import admin
from app.api.routes import auth


api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(books.router, prefix="/books", tags=["books"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(user_hidden_books.router, prefix="/user-books", tags=["user-books"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
