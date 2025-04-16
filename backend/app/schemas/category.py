import uuid
from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str
    
class CategoryOut(BaseModel):
    id: uuid.UUID
    name: str

    class Config:
        orm_mode = True
