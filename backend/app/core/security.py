# backend/app/core/security.py
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from typing import Any, Optional
from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

from app.config.settings import settings

# Initialize the hasher
ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(hashed_password: str, password: str)  -> bool:
    try:
        return ph.verify(hashed_password, password)
    except (VerifyMismatchError, InvalidHash):
        return False

def needs_rehash(hashed_password: str) -> bool:
    return ph.check_needs_rehash(hashed_password)

# JWT tokens
def create_access_token(subject: str, additional_claims: Optional[dict] = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    ) 
    payload: dict[str, Any] = {
        "sub" : subject,
        "exp" : expire,
        "type" : "access"
    }
    if additional_claims:
        payload.update(additional_claims)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload = {
        "sub" : subject,
        "exp" : expire,
        "type" : "refresh"
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> dict[str, Any]:
    try: 
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    
    except ExpiredSignatureError:
        raise ValueError("Token has expired")

    except InvalidTokenError:
        raise ValueError("Invaild token")
