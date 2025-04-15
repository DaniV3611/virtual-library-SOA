from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.db.session import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
