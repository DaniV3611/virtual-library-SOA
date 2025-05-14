from datetime import datetime
import uuid
from pydantic import BaseModel, ConfigDict
from app.utils.security_validations import sanitize_input


class Token(BaseModel):

    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    """
    Schema for JWT token payload
    """
    sub: str

class UserOut(BaseModel):

    id: uuid.UUID
    name: str
    email: str
    role: str  # 'admin' or 'customer'
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):

    name: str
    email: str
    password: str
    role: str = "customer"  # default role is 'customer'

    def sanitize(self):
        self.name = sanitize_input(self.name)
        self.email = sanitize_input(self.email)
        self.password = sanitize_input(self.password)
        self.role = sanitize_input(self.role)
