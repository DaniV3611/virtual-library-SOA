import uuid
from pydantic import BaseModel
from app.utils.security_validations import sanitize_input


class CategoryCreate(BaseModel):
    name: str

    def sanitize(self):
        self.name = sanitize_input(self.name)
    
class CategoryOut(BaseModel):
    id: uuid.UUID
    name: str

    class Config:
        from_attributes = True
