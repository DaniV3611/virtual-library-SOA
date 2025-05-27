from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict


class UserSessionBase(BaseModel):
    """Base schema for user sessions"""
    device_type: Optional[str] = None
    device_name: Optional[str] = None
    browser: Optional[str] = None
    os: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    location: Optional[str] = None
    login_method: Optional[str] = None


class UserSessionCreate(UserSessionBase):
    """Schema for creating a new user session"""
    session_token: str
    user_id: uuid.UUID


class UserSessionUpdate(BaseModel):
    """Schema for updating a user session"""
    last_activity: Optional[datetime] = None
    failed_attempts: Optional[int] = None
    is_suspicious: Optional[bool] = None
    session_metadata: Optional[str] = None


class UserSessionOut(UserSessionBase):
    """Schema for returning user session data"""
    id: uuid.UUID
    user_id: uuid.UUID
    session_token: str
    is_active: bool
    last_activity: datetime
    failed_attempts: int
    is_suspicious: bool
    created_at: datetime
    expires_at: datetime
    revoked_at: Optional[datetime] = None
    session_metadata: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserSessionRevoke(BaseModel):
    """Schema for revoking a user session"""
    session_id: uuid.UUID


class UserSessionsResponse(BaseModel):
    """Schema for returning multiple user sessions"""
    sessions: list[UserSessionOut]
    total: int 