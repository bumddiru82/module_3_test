from fastapi import APIRouter
from app.schemas.user import UserRead
from datetime import datetime

router = APIRouter()


@router.get("/users/me", response_model=UserRead)
async def get_current_user():
    """
    Get current user (mock data for now)
    Will be implemented with authentication system
    """
    return {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "full_name": "System Administrator",
        "is_active": True,
        "is_admin": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
