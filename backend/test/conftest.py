import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from databases import Database
import os

from app.main import app
from app.core.database import database as db_instance


# Set test environment
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./test.db"
os.environ["DEBUG"] = "True"


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def database() -> AsyncGenerator[Database, None]:
    """
    Create a fresh database for each test
    """
    # Connect to test database
    await db_instance.connect()

    # Initialize tables - Import models first
    from app.models.log import Log
    from app.models.user import User
    from app.core.database import init_db
    await init_db()

    yield db_instance

    # Cleanup: Drop all data
    try:
        await db_instance.execute("DELETE FROM logs")
        await db_instance.execute("DELETE FROM users")
    except Exception:
        pass

    # Disconnect
    await db_instance.disconnect()


@pytest.fixture(scope="function")
async def client(database: Database) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async HTTP client for testing
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
