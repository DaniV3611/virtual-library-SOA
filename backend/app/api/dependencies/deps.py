from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.crud.users import get_user_by_email
from app.models.user import User
from app.config.environment import JWT_SECRET
from app.schemas.user import TokenPayload
from app.api.dependencies.session import SessionDep


# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


def get_current_user(
    session: SessionDep, 
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Get the current user based on JWT token
    
    Args:
        session: Database session
        token: JWT token from request
        
    Returns:
        Current user object
        
    Raises:
        HTTPException: If authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
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
        
    return user


CurrentUserDep = Annotated[User, Depends(get_current_user)]


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
