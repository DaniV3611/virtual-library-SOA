from fastapi import APIRouter

from app.api.routes.books import router


api_router = APIRouter()

api_router.include_router(router, prefix="/books", tags=["books"])

