from datetime import datetime
from typing import List, Optional
import uuid
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.user_session import UserSession
from app.schemas.user_session import UserSessionCreate, UserSessionUpdate


def create_user_session(db: Session, session_data: UserSessionCreate) -> UserSession:
    """Create a new user session"""
    db_session = UserSession(**session_data.model_dump())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_user_session_by_id(db: Session, session_id: uuid.UUID) -> Optional[UserSession]:
    """Get a user session by ID"""
    return db.query(UserSession).filter(UserSession.id == session_id).first()


def get_user_session_by_token(db: Session, session_token: str) -> Optional[UserSession]:
    """Get a user session by session token"""
    return db.query(UserSession).filter(UserSession.session_token == session_token).first()


def get_user_sessions_by_user_id(
    db: Session, 
    user_id: uuid.UUID,
    active_only: bool = False,
    skip: int = 0,
    limit: int = 100
) -> List[UserSession]:
    """Get all sessions for a specific user"""
    query = db.query(UserSession).filter(UserSession.user_id == user_id)
    
    if active_only:
        query = query.filter(
            and_(
                UserSession.is_active == True,
                UserSession.expires_at > datetime.utcnow(),
                UserSession.revoked_at.is_(None)
            )
        )
    
    return query.offset(skip).limit(limit).all()


def count_user_sessions(db: Session, user_id: uuid.UUID, active_only: bool = False) -> int:
    """Count total sessions for a user"""
    query = db.query(UserSession).filter(UserSession.user_id == user_id)
    
    if active_only:
        query = query.filter(
            and_(
                UserSession.is_active == True,
                UserSession.expires_at > datetime.utcnow(),
                UserSession.revoked_at.is_(None)
            )
        )
    
    return query.count()


def update_user_session(
    db: Session, 
    session_id: uuid.UUID, 
    session_update: UserSessionUpdate
) -> Optional[UserSession]:
    """Update a user session"""
    db_session = get_user_session_by_id(db, session_id)
    if not db_session:
        return None
    
    update_data = session_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_session, key, value)
    
    db.commit()
    db.refresh(db_session)
    return db_session


def revoke_user_session(db: Session, session_id: uuid.UUID) -> Optional[UserSession]:
    """Revoke a user session"""
    db_session = get_user_session_by_id(db, session_id)
    if not db_session:
        return None
    
    db_session.revoke()
    db.commit()
    db.refresh(db_session)
    return db_session


def revoke_all_user_sessions(db: Session, user_id: uuid.UUID, except_session_id: Optional[uuid.UUID] = None) -> int:
    """Revoke all sessions for a user, optionally except one specific session"""
    query = db.query(UserSession).filter(
        and_(
            UserSession.user_id == user_id,
            UserSession.is_active == True,
            UserSession.revoked_at.is_(None)
        )
    )
    
    if except_session_id:
        query = query.filter(UserSession.id != except_session_id)
    
    sessions = query.all()
    count = 0
    for session in sessions:
        session.revoke()
        count += 1
    
    db.commit()
    return count


def cleanup_expired_sessions(db: Session) -> int:
    """Clean up expired sessions"""
    expired_sessions = db.query(UserSession).filter(
        and_(
            UserSession.expires_at < datetime.utcnow(),
            UserSession.is_active == True
        )
    ).all()
    
    count = 0
    for session in expired_sessions:
        session.is_active = False
        count += 1
    
    db.commit()
    return count 