# backend/app/features/auth/schema.py
from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID 

class UserSignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    city: str | None = None
    country: str | None = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    city: str | None = None
    country: str | None = None
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: str
    city: str | None
    country: str | None
