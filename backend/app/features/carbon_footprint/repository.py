from uuid import UUID
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.carbon_footprint.model import CarbonFootprint
from app.features.carbon_footprint.schema import CarbonFootprintCreate


async def create_carbon_footprint(
    db: AsyncSession, data: CarbonFootprintCreate, user_id: UUID, co2_emitted: float
) -> CarbonFootprint:
    carbon_footprint = CarbonFootprint(
        user_id=user_id,
        category=data.category,
        activity=data.activity,
        quantity=data.quantity,
        unit=data.unit,
        co2_emitted=co2_emitted,
    )

    try:
        db.add(carbon_footprint)
        await db.commit()
        await db.refresh(carbon_footprint)
    except Exception:
        await db.rollback()
        raise

    return carbon_footprint


async def list_carbon_footprints(
    db: AsyncSession,
    user_id: UUID,
    *,
    limit: int = 50,
    offset: int = 0,
) -> list[CarbonFootprint]:
    """Most-recent-first list of a user's carbon footprint entries."""
    query = (
        select(CarbonFootprint)
        .where(CarbonFootprint.user_id == user_id)
        .order_by(CarbonFootprint.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_carbon_footprint_totals(db: AsyncSession, user_id: UUID) -> dict:
    """Total co2_emitted and entry count for the dashboard."""
    query = select(
        func.coalesce(func.sum(CarbonFootprint.co2_emitted), 0.0).label("total_co2_emitted"),
        func.count(CarbonFootprint.id).label("total_entries"),
    ).where(CarbonFootprint.user_id == user_id)
    row = (await db.execute(query)).one()
    return {
        "total_co2_emitted": round(float(row.total_co2_emitted), 2),
        "total_entries": int(row.total_entries),
    }


async def get_carbon_footprint_totals_by_category(db: AsyncSession, user_id: UUID) -> list[dict]:
    """CO2 emitted grouped by category (for the dashboard breakdown bars)."""
    query = (
        select(
            CarbonFootprint.category,
            func.coalesce(func.sum(CarbonFootprint.co2_emitted), 0.0),
        )
        .where(CarbonFootprint.user_id == user_id)
        .group_by(CarbonFootprint.category)
    )
    rows = (await db.execute(query)).all()
    return [{"category": category, "co2_emitted": round(float(total), 2)} for category, total in rows]
