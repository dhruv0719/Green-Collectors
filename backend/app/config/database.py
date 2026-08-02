# backend/app/config/database.py
from datetime import datetime
from sqlalchemy import DateTime, func
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from app.config.settings import settings

engine = create_async_engine(settings.DATABASE_URL, echo=settings.DB_ECHO)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    """SQLAlchemy declarative base — import this in every model."""
    pass

class TimeStampMixin:
    """Mixin to add created_at and updated_at timestamps to models."""
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency: yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()