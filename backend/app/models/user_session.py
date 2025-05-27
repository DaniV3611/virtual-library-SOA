from datetime import datetime, timedelta
import uuid
from sqlalchemy import Column, DateTime, ForeignKey, Text, String, Boolean, Integer
from app.db.session import Base
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship


def default_expiration():
    """Returns the default expiration date (7 days from now)"""
    return datetime.utcnow() + timedelta(days=7)


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    session_token = Column(Text, nullable=False, unique=True)
    
    # Device Information
    device_type = Column(String(20))  # mobile, desktop, tablet
    device_name = Column(String(100))  # iPhone 15, Windows PC, etc.
    browser = Column(String(50))  # Chrome, Safari, Firefox
    os = Column(String(50))  # iOS, Windows, macOS, Android
    user_agent = Column(Text)
    
    # Network Information
    ip_address = Column(INET)
    location = Column(String(100))  # City, Country or coordinates
    
    # Session Metadata
    is_active = Column(Boolean, default=True)
    last_activity = Column(DateTime, default=datetime.utcnow)
    login_method = Column(String(20))  # password, oauth, sso
    
    # Security Information
    failed_attempts = Column(Integer, default=0)
    is_suspicious = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False, default=default_expiration)
    revoked_at = Column(DateTime)
    
    # Additional metadata as JSON
    session_metadata = Column(Text)  # JSON string for flexible additional data

    user = relationship("User", back_populates="user_sessions")
    
    @property
    def is_expired(self):
        """Check if session has expired"""
        return datetime.utcnow() > self.expires_at
    
    @property
    def is_valid(self):
        """Check if session is valid (active, not expired, not revoked)"""
        return (self.is_active and 
                not self.is_expired and 
                self.revoked_at is None)
    
    def revoke(self):
        """Revoke the session"""
        self.is_active = False
        self.revoked_at = datetime.utcnow()
    
    def update_activity(self):
        """Update last activity timestamp"""
        self.last_activity = datetime.utcnow()

