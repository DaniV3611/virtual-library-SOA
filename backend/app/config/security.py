from datetime import datetime, timedelta
from typing import Optional

import bcrypt
from jose import jwt

from app.config.environment import JWT_EXPIRATION, JWT_SECRET


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token for authentication
    
    Args:
        data: Data to encode in the token
        expires_delta: Optional time delta for token expiration
        
    Returns:
        Encoded JWT token as string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=JWT_EXPIRATION
        )
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, 
        JWT_SECRET, 
        algorithm="HS256"
    )
    
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hash
    
    Args:
        plain_password: Password in plain text
        hashed_password: Hashed password for verification
        
    Returns:
        True if password matches, False otherwise
    """
    # Convert string to bytes if it's not already bytes
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
        
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
        
    return bcrypt.checkpw(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a password for storing
    
    Args:
        password: Password in plain text
        
    Returns:
        Hashed password as string
    """
    # Convert string to bytes if it's not already bytes
    if isinstance(password, str):
        password = password.encode('utf-8')
        
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
    
    # Return as string for easier database storage
    if isinstance(hashed_password, bytes):
        return hashed_password.decode('utf-8')
    
    return hashed_password
