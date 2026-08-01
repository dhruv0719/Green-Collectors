# backend/app/features/auth/model.py
import uuid
from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base, TimeStampMixin

if TYPE_CHECKING:
    from app.features.green_actions.model import GreenAction
    from app.features.carbon_footprint.model import CarbonFootprint

class User(Base, TimeStampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True),primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(100) , nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(225), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(225) , nullable=False)
    city: Mapped[str | None] = mapped_column(nullable=True)
    country: Mapped[str | None] = mapped_column(nullable=True)

    green_actions: Mapped[list["GreenAction"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    carbon_footprints: Mapped[list["CarbonFootprint"]] = relationship(back_populates="user", cascade="all, delete-orphan")