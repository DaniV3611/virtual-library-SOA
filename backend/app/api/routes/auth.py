from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.schemas.user import Token
from app.schemas.encrypted_auth import EncryptedCredentials, PublicKeyResponse
from app.api.dependencies.session import SessionDep
from app.crud.users import get_user_by_email
from app.crud.user_sessions import create_user_session, revoke_all_user_sessions
from app.config.security import create_access_token, verify_password
from app.config.environment import JWT_EXPIRATION
from app.utils.security_validations import contains_blacklisted, is_valid_email
from app.utils.encryption import encryption_manager

router = APIRouter()


@router.get("/public-key", response_model=PublicKeyResponse)
def get_public_key() -> PublicKeyResponse:
    """
    Gets the server's RSA public key for encrypting credentials
    """
    return PublicKeyResponse(public_key=encryption_manager.get_public_key_pem())


@router.post("/login-encrypted", response_model=Token)
def login_with_encrypted_credentials(
    request: Request,
    session: SessionDep,
    encrypted_credentials: EncryptedCredentials
) -> Token:
    """
    Login endpoint that accepts encrypted credentials
    """
    try:
        # Decrypt the credentials
        credentials = encryption_manager.decrypt_credentials(
            encrypted_credentials.encrypted_data,
            encrypted_credentials.encrypted_key,
            encrypted_credentials.iv
        )
        
        username = credentials.get("username")
        password = credentials.get("password")
        
        if not username or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing username or password in encrypted data",
            )
        
        # Security validations
        if contains_blacklisted(username) or contains_blacklisted(password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Blacklisted words found",
            )
        
        if not is_valid_email(username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format",
            )

        # Verify credentials
        user = get_user_by_email(session, email=username)
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=JWT_EXPIRATION)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        # Create user session
        user_agent = request.headers.get("user-agent", "")
        client_ip = request.client.host if request.client else "unknown"
        
        # Parse user agent for device information
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
        
        # Revoke all existing sessions for this user
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
            login_method="encrypted_password"
        )
        
        create_user_session(session, session_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to decrypt credentials: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email or password is incorrect",
        )
        
