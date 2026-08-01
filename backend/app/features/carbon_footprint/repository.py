# backend/app/features/carbon_footprint/repository.py
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.carbon_footprint.model import CarbonFootprint
from app.features.carbon_footprint.schema import CarbonFootprintCreate

async def create_carbon_footprint(db: AsyncSession, data: CarbonFootprintCreate, user_id: UUID, co2_emitted: float) -> CarbonFootprint:
    carbon_footprint = CarbonFootprint(
        user_id=user_id,
        category=data.category,
        activity=data.activity,
        quantity=data.quantity,
        unit=data.unit,
        co2_emitted=co2_emitted
    )

    try:
        db.add(carbon_footprint)
        await db.commit()
        await db.refresh(carbon_footprint)

    except Exception:
        await db.rollback()
        raise

    return carbon_footprint