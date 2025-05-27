import json
import base64
from typing import Dict, Any, Tuple
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import os


class EncryptionManager:
    """Manages hybrid RSA+AES encryption and decryption"""
    
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self._generate_or_load_keys()
    
    def _generate_or_load_keys(self):
        """Generates or loads RSA keys"""
        private_key_path = "private_key.pem"
        public_key_path = "public_key.pem"
        
        # If keys already exist, load them
        if os.path.exists(private_key_path) and os.path.exists(public_key_path):
            try:
                with open(private_key_path, "rb") as f:
                    self.private_key = serialization.load_pem_private_key(
                        f.read(),
                        password=None,
                        backend=default_backend()
                    )
                
                with open(public_key_path, "rb") as f:
                    self.public_key = serialization.load_pem_public_key(
                        f.read(),
                        backend=default_backend()
                    )
                return
            except Exception as e:
                print(f"Error loading existing keys: {e}")
        
        # Generate new keys if they don't exist or there's an error
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        self.public_key = self.private_key.public_key()
        
        # Save the keys
        try:
            with open(private_key_path, "wb") as f:
                f.write(self.private_key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.PKCS8,
                    encryption_algorithm=serialization.NoEncryption()
                ))
            
            with open(public_key_path, "wb") as f:
                f.write(self.public_key.public_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PublicFormat.SubjectPublicKeyInfo
                ))
        except Exception as e:
            print(f"Error saving keys: {e}")
    
    def get_public_key_pem(self) -> str:
        """Returns the public key in PEM format as a string"""
        return self.public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')
    
    def decrypt_credentials(self, encrypted_data: str, encrypted_key: str, iv: str) -> Dict[str, str]:
        """
        Decrypts credentials using hybrid RSA+AES encryption
        
        Args:
            encrypted_data: AES-encrypted data (base64)
            encrypted_key: RSA-encrypted AES key (base64)
            iv: Initialization vector for AES (hex)
        
        Returns:
            Dict with decrypted credentials
        """
        try:
            # 1. Decrypt the AES key using RSA
            encrypted_key_bytes = base64.b64decode(encrypted_key)
            aes_key_hex = self.private_key.decrypt(
                encrypted_key_bytes,
                padding.OAEP(
                    mgf=padding.MGF1(algorithm=hashes.SHA256()),
                    algorithm=hashes.SHA256(),
                    label=None
                )
            ).decode('utf-8')
            
            # 2. Convert AES key from hex to bytes
            aes_key = bytes.fromhex(aes_key_hex)
            
            # 3. Convert IV from hex to bytes
            iv_bytes = bytes.fromhex(iv)
            
            # 4. Decrypt data with AES
            encrypted_data_bytes = base64.b64decode(encrypted_data)
            
            cipher = Cipher(
                algorithms.AES(aes_key),
                modes.CBC(iv_bytes),
                backend=default_backend()
            )
            decryptor = cipher.decryptor()
            
            # Decrypt and remove padding
            decrypted_padded = decryptor.update(encrypted_data_bytes) + decryptor.finalize()
            
            # Remove PKCS7 padding manually
            padding_length = decrypted_padded[-1]
            decrypted_data = decrypted_padded[:-padding_length]
            
            # 5. Convert from JSON to dict
            credentials_json = decrypted_data.decode('utf-8')
            credentials = json.loads(credentials_json)
            
            return credentials
            
        except Exception as e:
            raise ValueError(f"Failed to decrypt credentials: {str(e)}")


# Global instance of the encryption manager
encryption_manager = EncryptionManager() 