from fastapi import APIRouter, Depends
from databases import Database
from app.core.database import get_database
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check(db: Database = Depends(get_database)):
    """
    Health check endpoint
    Returns system status, database connection status, and version info
    """
    db_status = "connected"
    try:
        await db.fetch_one("SELECT 1")
    except Exception:
        db_status = "disconnected"

    return {
        "status": "ok",
        "database": db_status,
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG
    }
