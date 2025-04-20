from app.models.cart_item import CartItem
from app.models.book import Book


def get_all_cart_items(session, user_id):
    """
    Get all cart items for the current user.
    """
    cart_items = []
    cart_items_db = session.query(CartItem).filter(CartItem.user_id == user_id).all()
    
    for cart_item in cart_items_db:
        book = session.query(Book).filter(Book.id == cart_item.book_id).first()
        if book:
            cart_items.append({
                "id": cart_item.id,
                "book": book
            })

    return cart_items

def create_cart_item(session, user_id, cart_item_create):
    """
    Create a new cart item.
    """
    cart_item = None
    book = session.query(Book).filter(Book.id == cart_item_create.book_id).first()
    if book:
        cart_item_db = CartItem(
            user_id=user_id,
            book_id=cart_item_create.book_id,
            quantity=cart_item_create.quantity
        )
        session.add(cart_item_db)
        session.commit()
        session.refresh(cart_item_db)

        cart_item = {
            "id": cart_item_db.id,
            "book": book,
            "quantity": cart_item_create.quantity
        }
    
    return cart_item

def delete_cart_item_db(session, user_id, cart_item_id):
    """
    Delete a cart item.
    """
    cart_item = session.query(CartItem).filter(CartItem.id == cart_item_id, CartItem.user_id == user_id).first()
    if cart_item:
        session.delete(cart_item)
        session.commit()
        return True
    return False
