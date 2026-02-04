from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import database, init_db
from app.api import health, logs, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    await database.connect()
    await init_db()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} started")
    print(f"📊 Database connected: {settings.DATABASE_URL}")

    yield

    # Shutdown
    await database.disconnect()
    print("👋 Application shutdown")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="방화벽 로그 모니터링 시스템 API",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/api/v1/health"
    }

# Register routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(logs.router, prefix="/api/v1", tags=["Logs"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
