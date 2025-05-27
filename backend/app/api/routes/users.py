from datetime import timedelta
from typing import Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user import Token, UserCreate, UserOut
from app.schemas.user_session import UserSessionOut, UserSessionsResponse, UserSessionRevoke
from app.api.dependencies.session import SessionDep
from app.api.dependencies.deps import CurrentUserDep, UserIsAdminDep
from app.crud.users import create_user_db, get_user_by_email, get_user_by_id
from app.crud.user_sessions import (
    create_user_session, get_user_sessions_by_user_id, 
    count_user_sessions, revoke_user_session, revoke_all_user_sessions,
    get_user_session_by_token
)
from app.config.security import create_access_token, verify_password
from app.config.environment import JWT_EXPIRATION
from app.utils.security_validations import contains_blacklisted, is_valid_email, is_valid_role

router = APIRouter()


@router.post("/login", response_model=Token)
def login_for_access_token(
    request: Request,
    session: SessionDep,
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    """
    OAuth2 compatible login endpoint to get an access token and create user session
    """
    if contains_blacklisted(form_data.username) or contains_blacklisted(form_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blacklisted words found",
        )
    
    if not is_valid_email(form_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format",
        )

    user = get_user_by_email(session, email=form_data.username)
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=JWT_EXPIRATION)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Create user session
    user_agent = request.headers.get("user-agent", "")
    client_ip = request.client.host if request.client else "unknown"
    
    # Parse user agent for device info (basic parsing)
    device_type = "unknown"
    browser = "unknown"
    os = "unknown"
    
    if user_agent:
        user_agent_lower = user_agent.lower()
        # Basic device type detection
        if "mobile" in user_agent_lower or "android" in user_agent_lower or "iphone" in user_agent_lower:
            device_type = "mobile"
        elif "tablet" in user_agent_lower or "ipad" in user_agent_lower:
            device_type = "tablet"
        else:
            device_type = "desktop"
        
        # Basic browser detection
        if "chrome" in user_agent_lower:
            browser = "Chrome"
        elif "firefox" in user_agent_lower:
            browser = "Firefox"
        elif "safari" in user_agent_lower:
            browser = "Safari"
        elif "edge" in user_agent_lower:
            browser = "Edge"
        
        # Basic OS detection
        if "windows" in user_agent_lower:
            os = "Windows"
        elif "mac" in user_agent_lower:
            os = "macOS"
        elif "linux" in user_agent_lower:
            os = "Linux"
        elif "android" in user_agent_lower:
            os = "Android"
        elif "ios" in user_agent_lower:
            os = "iOS"
    
    # Revoke all existing sessions for this user before creating new one
    # This ensures only one active session per user across all devices/browsers
    revoke_all_user_sessions(session, user_id=user.id, except_session_id=None)
    
    from app.schemas.user_session import UserSessionCreate
    session_data = UserSessionCreate(
        session_token=access_token,
        user_id=user.id,
        device_type=device_type,
        browser=browser,
        os=os,
        user_agent=user_agent,
        ip_address=client_ip,
        login_method="password"
    )
    
    create_user_session(session, session_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate,
    session: SessionDep
) -> UserOut:
    """
    Register a new user
    """
    if contains_blacklisted(user_in.email) or contains_blacklisted(user_in.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Blacklisted words found",
        )

    if not is_valid_email(user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format",
        )
    if not is_valid_role(user_in.role):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )
    user = get_user_by_email(session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    user_db = create_user_db(session, user_in)
    return user_db

@router.post("/me", response_model=UserOut)
def test_token(
    current_user: CurrentUserDep
) -> UserOut:
    """
    Test token endpoint
    """
    return current_user

@router.get("/me", response_model=UserOut)
def test_token(
    current_user: CurrentUserDep
) -> UserOut:
    """
    Test token endpoint
    """
    return current_user


@router.get("/user/{user_id}", response_model=UserOut)
def get_user(
    user_id: str,
    session: SessionDep,
    current_user: UserIsAdminDep
) -> UserOut:
    """
    Get user by ID (admin only)
    """

    user = get_user_by_id(session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user


@router.get("/sessions", response_model=UserSessionsResponse)
def get_user_sessions(
    session: SessionDep,
    current_user: CurrentUserDep,
    active_only: Optional[bool] = Query(False, description="Filter to show only active sessions"),
    skip: int = Query(0, ge=0, description="Number of sessions to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of sessions to return")
) -> UserSessionsResponse:
    """
    Get all sessions for the current user
    """
    user_sessions = get_user_sessions_by_user_id(
        session, 
        user_id=current_user.id,
        active_only=active_only,
        skip=skip,
        limit=limit
    )
    
    total = count_user_sessions(session, user_id=current_user.id, active_only=active_only)
    
    return UserSessionsResponse(
        sessions=user_sessions,
        total=total
    )


@router.post("/sessions/revoke", response_model=dict)
def revoke_session(
    session_revoke: UserSessionRevoke,
    session: SessionDep,
    current_user: CurrentUserDep
) -> dict:
    """
    Revoke a specific user session
    """
    # First, verify the session belongs to the current user
    user_sessions = get_user_sessions_by_user_id(session, user_id=current_user.id)
    session_ids = [s.id for s in user_sessions]
    
    if session_revoke.session_id not in session_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or does not belong to current user",
        )
    
    revoked_session = revoke_user_session(session, session_revoke.session_id)
    if not revoked_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )
    
    return {
        "message": "Session revoked successfully",
        "session_id": str(session_revoke.session_id)
    }


@router.post("/sessions/revoke-all", response_model=dict)
def revoke_all_sessions(
    session: SessionDep,
    current_user: CurrentUserDep,
    keep_current: Optional[bool] = Query(True, description="Keep the current session active")
) -> dict:
    """
    Revoke all user sessions, optionally keeping the current session active
    """
    current_session_id = None
    
    if keep_current:
        # Try to find the current session by token
        # Note: This is a simplified approach. In a real implementation,
        # you might want to pass the current token through the dependency
        current_sessions = get_user_sessions_by_user_id(
            session, 
            user_id=current_user.id, 
            active_only=True
        )
        # For simplicity, we'll keep the most recent session if keep_current is True
        if current_sessions:
            current_session_id = max(current_sessions, key=lambda x: x.last_activity).id
    
    revoked_count = revoke_all_user_sessions(
        session, 
        user_id=current_user.id, 
        except_session_id=current_session_id if keep_current else None
    )
    
    return {
        "message": f"Successfully revoked {revoked_count} sessions",
        "revoked_count": revoked_count,
        "current_session_kept": keep_current and current_session_id is not None
    }


# @router.put("/me", response_model=UserOut)
# async def update_user_me(
#     user_in: UserUpdate,
#     current_user = Depends(get_current_active_user),
#     session: SessionDep = Depends()
# ) -> Any:
#     """
#     Update own user information
#     """
#     if user_in.password:
#         user_in.hashed_password = get_password_hash(user_in.password)
#         delattr(user_in, "password")
    
#     for key, value in user_in.dict(exclude_unset=True).items():
#         setattr(current_user, key, value)
    
#     session.add(current_user)
#     session.commit()
#     session.refresh(current_user)
    
#     return current_user

