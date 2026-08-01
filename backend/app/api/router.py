# app/api/router.py
from fastapi import APIRouter

from app.features.auth.router import router as auth_router
from app.features.green_actions.router import router as green_actions_router
from app.features.carbon_footprint.router import router as carbon_footprint_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(green_actions_router)
api_router.include_router(carbon_footprint_router)