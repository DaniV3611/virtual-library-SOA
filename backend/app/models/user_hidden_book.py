from datetime import datetime
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base


class UserHiddenBook(Base):
    __tablename__ = "user_hidden_books"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    book_id = Column(UUID(as_uuid=True), ForeignKey("books.id"), nullable=False)
    hidden_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")
    book = relationship("Book")

    # Ensure a user can only hide a book once
    __table_args__ = (
        UniqueConstraint('user_id', 'book_id', name='unique_user_hidden_book'),
    ) 