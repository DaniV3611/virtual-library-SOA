from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.user import Token, UserCreate, UserOut
from app.api.dependencies.session import SessionDep
from app.api.dependencies.deps import CurrentUserDep, UserIsAdminDep
from app.crud.users import create_user_db, get_user_by_email, get_user_by_id
from app.config.security import create_access_token, verify_password
from app.config.environment import JWT_EXPIRATION

router = APIRouter()


@router.post("/login", response_model=Token)
def login_for_access_token(
    session: SessionDep,
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Token:
    """
    OAuth2 compatible login endpoint to get an access token
    """
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

