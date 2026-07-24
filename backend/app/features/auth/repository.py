# backend/app/features/auth/repository.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.features.auth.schema import UserCreate
from app.features.auth.model import User

async def create_user(db: AsyncSession, data: UserCreate) -> User:
    user = User(
        first_name = data.first_name,
        last_name = data.last_name, 
        email = data.email, 
        hashed_password = data.hashed_password,
        city = data.city, 
        country = data.country
    )

    try: 
        db.add(user)
        await db.commit()
        await db.refresh(user)
    except:
        await db.rollback()
        raise
    return user

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    query = select(User).where(User.email == email)

    result = await db.execute(query)

    return result.scalar_one_or_none()