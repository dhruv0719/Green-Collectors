# backend/app/feature/green_actions/model.py
import uuid
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.config.database import Base, TimeStampMixin

class GreenAction(Base, TimeStampMixin):
    __tablename__ = "greenaction"

    pass