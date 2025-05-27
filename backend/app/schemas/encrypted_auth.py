from pydantic import BaseModel


class EncryptedCredentials(BaseModel):
    """Schema for encrypted credentials"""
    encrypted_data: str
    encrypted_key: str
    iv: str


class PublicKeyResponse(BaseModel):
    """Schema for public key response"""
    public_key: str 