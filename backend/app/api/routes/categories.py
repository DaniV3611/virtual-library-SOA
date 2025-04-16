from typing import List
from fastapi import APIRouter, HTTPException, status

from app.api.dependencies.session import SessionDep
from app.crud.categories import create_category_db, get_all_categories, get_category_by_id
from app.schemas.category import CategoryCreate, CategoryOut
from app.api.dependencies.deps import UserIsAdminDep


router = APIRouter()

@router.get("/", response_model=List[CategoryOut])
def get_categories(session: SessionDep):
    """
    Get all categories.
    """
    categories = get_all_categories(session)
    return categories

@router.post("/", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, session: SessionDep, current_user: UserIsAdminDep):
    """
    Create a new category.
    """
    # Assuming you have a function to create a category in your database
    db_category = create_category_db(session, category)
    return db_category

@router.get("/{category_id}", response_model=CategoryOut)
def get_category(category_id: str, session: SessionDep):
    """
    Get a category by ID.
    """
    # Assuming you have a function to get a category by ID in your database
    category = get_category_by_id(session, category_id)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category
