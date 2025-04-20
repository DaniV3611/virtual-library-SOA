from typing import List
from fastapi import APIRouter, HTTPException

from app.api.dependencies.session import SessionDep
from app.api.dependencies.deps import CurrentUserDep
from app.crud.cart import create_cart_item, delete_cart_item_db, get_all_cart_items
from app.schemas.cart_item import CartItemCreate, CartItemOut


router = APIRouter()

@router.get("/", response_model=List[CartItemOut])
def get_cart_items(
    session: SessionDep,
    current_user: CurrentUserDep,  
):
    """
    Get all cart items for the current user.
    """
    cart_items = get_all_cart_items(session, current_user.id)
    return cart_items

@router.post("/", response_model=CartItemOut)
def add_cart_item(
    session: SessionDep,
    current_user: CurrentUserDep,  
    cart_item: CartItemCreate,
):
    """
    Add a book to the cart.
    """
    try:
        cart_item_db = create_cart_item(session, current_user.id, cart_item)
    except Exception as e:
        if "unique constraint" in str(e).lower():
            raise HTTPException(status_code=400, detail="Item already exists in the cart")
        raise HTTPException(status_code=400, detail=str(e))
    if not cart_item_db:
        raise HTTPException(status_code=400, detail="Book not found")
    return cart_item_db

@router.delete("/{cart_item_id}", response_model=bool)
def delete_cart_item(
    session: SessionDep,
    current_user: CurrentUserDep,  
    cart_item_id: str,
):
    """
    Delete a cart item.
    """
    res = delete_cart_item_db(session, current_user.id, cart_item_id)
    if not res:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return res
