import re

BLACKLISTED_WORDS = ["DROP", "SELECT", "--"]

# Sanitiza un string eliminando caracteres peligrosos y espacios innecesarios
def sanitize_input(input_str: str) -> str:
    # Elimina scripts, etiquetas HTML y caracteres especiales comunes de XSS
    sanitized = re.sub(r'<.*?>', '', input_str)  # elimina etiquetas HTML
    sanitized = re.sub(r'["\'`;]', '', sanitized)  # elimina comillas y punto y coma
    sanitized = re.sub(r'--', '', sanitized)  # elimina doble guion
    sanitized = sanitized.strip()
    return sanitized

def contains_blacklisted(input_str: str) -> bool:
    return any(word in input_str.upper() for word in BLACKLISTED_WORDS)

def is_valid_email(email: str) -> bool:
    """Valida si el email tiene un formato correcto usando una expresión regular."""
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w{2,}$"
    return re.match(pattern, email) is not None

def is_valid_role(role: str) -> bool:
    """Valida si el rol es uno de los permitidos."""
    allowed_roles = ["admin", "customer"]
    return role in allowed_roles
