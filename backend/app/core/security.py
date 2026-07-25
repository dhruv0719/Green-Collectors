# backend/app/core/security.py
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Initialize the hasher
ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(hashed_password: str, password: str):
    try:
        ph.verify(hashed_password, password)
        return True
    except VerifyMismatchError:
        return False

def needs_rehash(hashed_password: str) -> bool:
    return ph.check_needs_rehash(hashed_password)