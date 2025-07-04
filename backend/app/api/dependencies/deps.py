from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.crud.users import get_user_by_email
from app.crud.user_sessions import get_user_session_by_token
from app.models.user import User
from app.config.environment import JWT_SECRET
from app.schemas.user import TokenPayload
from app.api.dependencies.session import SessionDep


# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")

# Optional OAuth2 scheme for token authentication
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/users/login", auto_error=False)


def get_current_user(
    session: SessionDep, 
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Get the current user based on JWT token and validate session is active
    
    Args:
        session: Database session
        token: JWT token from request
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If authentication fails or session is invalid
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    session_invalid_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session has been revoked or expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, 
            JWT_SECRET, 
            algorithms=["HS256"]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenPayload(sub=email)
    except JWTError:
        raise credentials_exception
        
    user = get_user_by_email(session, email=token_data.sub)
    if user is None:
        raise credentials_exception
    
    # Validate that the session is still active
    user_session = get_user_session_by_token(session, token)
    if user_session is None:
        raise session_invalid_exception
    
    # Check if session is valid (active, not expired, not revoked)
    if not user_session.is_valid:
        raise session_invalid_exception
    
    # Update last activity for valid sessions
    user_session.update_activity()
    session.commit()
        
    return user


CurrentUserDep = Annotated[User, Depends(get_current_user)]


def get_current_user_optional(
    session: SessionDep, 
    token: Optional[str] = Depends(oauth2_scheme_optional)
) -> Optional[User]:
    """
    Get the current user based on JWT token, but return None if not authenticated
    
    Args:
        session: Database session
        token: JWT token from request (optional)
        
    Returns:
        Current user object or None if not authenticated
    """
    if token is None:
        return None
        
    try:
        payload = jwt.decode(
            token, 
            JWT_SECRET, 
            algorithms=["HS256"]
        )
        email: str = payload.get("sub")
        if email is None:
            return None
        token_data = TokenPayload(sub=email)
    except JWTError:
        return None
        
    user = get_user_by_email(session, email=token_data.sub)
    if user is None:
        return None
    
    # Validate that the session is still active
    user_session = get_user_session_by_token(session, token)
    if user_session is None:
        return None
    
    # Check if session is valid (active, not expired, not revoked)
    if not user_session.is_valid:
        return None
    
    # Update last activity for valid sessions
    user_session.update_activity()
    session.commit()
        
    return user


OptionalCurrentUserDep = Annotated[Optional[User], Depends(get_current_user_optional)]


def get_current_admin_user(
    current_user: CurrentUserDep
) -> User:
    """
    Get current user and verify they have admin privileges
    
    Args:
        current_user: User from get_current_active_user dependency
        
    Returns:
        Current admin user
        
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

UserIsAdminDep = Annotated[User, Depends(get_current_admin_user)]
