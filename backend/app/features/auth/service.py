# backend/app/features/auth/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.auth import schema
from app.core.security import hash_password
from app.features.auth.repository import get_user_by_email, create_user

async def signup(db:AsyncSession, data: schema.UserSignupRequest) -> schema.UserResponse:
    user_email = await get_user_by_email(db, data.email)
    if user_email is not None:
        raise ValueError("Email already exists")

    password = hash_password(data.password)
    user = schema.UserCreate(
        first_name = data.first_name,
        last_name = data.last_name,
        email = data.email,
        hashed_password = password,
        city = data.city,
        country = data.country
    )   

    created_user  = await create_user(db, user)

    user_response = schema.UserResponse(
        id = created_user.id,
        first_name = created_user.first_name,
        last_name=created_user.last_name,
        email=created_user.email,
        city=created_user.city,
        country=created_user.country
    )

    return user_response