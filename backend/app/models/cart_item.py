from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from app.db.session import Base

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    book_id = Column(UUID(as_uuid=True), ForeignKey("books.id"))
    quantity = Column(Integer, nullable=False)

    user = relationship("User", back_populates="cart_items")
    book = relationship("Book")

    __table_args__ = (UniqueConstraint("user_id", "book_id", name="uq_user_book_cart"),)
