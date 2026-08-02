from uuid import UUID
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.green_actions.model import GreenAction
from app.features.green_actions.schema import GreenActionCreate


async def create_green_action(
    db: AsyncSession, data: GreenActionCreate, user_id: UUID, co2_saved: float
) -> GreenAction:
    green_action = GreenAction(
        user_id=user_id,
        category=data.category,
        activity=data.activity,
        quantity=data.quantity,
        unit=data.unit,
        location=data.location,
        co2_saved=co2_saved,
    )

    try:
        db.add(green_action)
        await db.commit()
        await db.refresh(green_action)
    except Exception:
        await db.rollback()
        raise

    return green_action


async def list_green_actions(
    db: AsyncSession,
    user_id: UUID,
    *,
    limit: int = 50,
    offset: int = 0,
) -> list[GreenAction]:
    """Most-recent-first list of a user's green actions."""
    query = (
        select(GreenAction)
        .where(GreenAction.user_id == user_id)
        .order_by(GreenAction.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_green_action_totals(db: AsyncSession, user_id: UUID) -> dict:
    """Total co2_saved, tree count and action count for the dashboard.

    Tree count sums the quantity of tree-planting actions (a tree-planting
    action logs the number of trees in `quantity`), not the number of rows.
    """
    query = select(
        func.coalesce(func.sum(GreenAction.co2_saved), 0.0).label("total_co2_saved"),
        func.coalesce(
            func.sum(GreenAction.quantity).filter(
                GreenAction.activity == "tree_planting"
            ),
            0.0,
        ).label("total_trees"),
        func.count(GreenAction.id).label("total_actions"),
    ).where(GreenAction.user_id == user_id)
    row = (await db.execute(query)).one()
    return {
        "total_co2_saved": round(float(row.total_co2_saved), 2),
        "total_trees": int(round(float(row.total_trees))),
        "total_actions": int(row.total_actions),
    }


async def get_green_action_totals_by_category(db: AsyncSession, user_id: UUID) -> list[dict]:
    """CO2 saved grouped by category (for the dashboard breakdown bars)."""
    query = (
        select(
            GreenAction.category,
            func.coalesce(func.sum(GreenAction.co2_saved), 0.0),
        )
        .where(GreenAction.user_id == user_id)
        .group_by(GreenAction.category)
    )
    rows = (await db.execute(query)).all()
    return [{"category": category, "co2_saved": round(float(total), 2)} for category, total in rows]


async def get_weekly_trend(
    db: AsyncSession,
    user_id: UUID,
    model,
    value_column,
    *,
    weeks: int = 6,
) -> list[dict]:
    """Weekly sum of `value_column` for the last `weeks` ISO weeks (oldest first)."""
    today = datetime.now(timezone.utc).date()
    monday = today - timedelta(days=today.weekday())
    since = monday - timedelta(weeks=weeks - 1)

    query = (
        select(
            func.date_trunc("week", model.created_at).label("week"),
            func.coalesce(func.sum(value_column), 0.0).label("total"),
        )
        .where(model.user_id == user_id)
        .where(model.created_at >= since)
        .group_by("week")
        .order_by("week")
    )
    rows = (await db.execute(query)).all()

    by_week = {row.week.date(): round(float(row.total), 2) for row in rows}

    # Fill every week in the window so the frontend always gets a full series.
    series = []
    for i in range(weeks):
        week_start = monday - timedelta(weeks=weeks - 1 - i)
        series.append({"week_start": week_start, "total": by_week.get(week_start, 0.0)})
    return series
