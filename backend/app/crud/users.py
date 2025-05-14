from app.api.dependencies.session import SessionDep
from app.models.user import User
from app.schemas.user import UserCreate
from app.config.security import get_password_hash


def get_user_by_email(session: SessionDep, email: str) -> User:
    """
    Get a user by email from the database.
    """
    user = session.query(User).filter(User.email == email).first()
    return user

def get_user_by_id(session: SessionDep, user_id: str) -> User:
    """
    Get a user by ID from the database.
    """
    user = session.query(User).filter(User.id == user_id).first()
    return user

def create_user_db(session: SessionDep, user: UserCreate) -> User:
    """
    Create a new user in the database.
    """
    user.sanitize()  # Desinfección de entradas
    password_hash = get_password_hash(user.password)  # Hash the password before storing it
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=password_hash,  # Hash the password before storing it
        role=user.role,  # 'admin' or 'customer'
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user
