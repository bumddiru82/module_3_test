import pytest
from httpx import AsyncClient


class TestUsersEndpoints:
    """Users API endpoint tests"""

    @pytest.mark.asyncio
    async def test_get_current_user(self, client: AsyncClient):
        """현재 사용자 정보를 조회한다"""
        response = await client.get("/api/v1/users/me")

        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "username" in data
        assert "email" in data
        assert "full_name" in data
        assert "is_active" in data
        assert "is_admin" in data
        assert "created_at" in data
        assert "updated_at" in data

    @pytest.mark.asyncio
    async def test_get_current_user_structure(self, client: AsyncClient):
        """현재 사용자 응답이 올바른 구조를 가진다"""
        response = await client.get("/api/v1/users/me")

        assert response.status_code == 200
        data = response.json()

        # Check required fields
        required_fields = [
            "id", "username", "email", "full_name",
            "is_active", "is_admin", "created_at", "updated_at"
        ]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"

    @pytest.mark.asyncio
    async def test_get_current_user_data_types(self, client: AsyncClient):
        """현재 사용자 데이터가 올바른 타입을 가진다"""
        response = await client.get("/api/v1/users/me")

        assert response.status_code == 200
        data = response.json()

        assert isinstance(data["id"], int)
        assert isinstance(data["username"], str)
        assert isinstance(data["email"], str)
        assert isinstance(data["is_active"], bool)
        assert isinstance(data["is_admin"], bool)
        assert isinstance(data["created_at"], str)
        assert isinstance(data["updated_at"], str)

    @pytest.mark.asyncio
    async def test_get_current_user_mock_data(self, client: AsyncClient):
        """현재 사용자가 예상된 Mock 데이터를 반환한다"""
        response = await client.get("/api/v1/users/me")

        assert response.status_code == 200
        data = response.json()

        # Verify mock data
        assert data["id"] == 1
        assert data["username"] == "admin"
        assert data["email"] == "admin@example.com"
        assert data["full_name"] == "System Administrator"
        assert data["is_active"] is True
        assert data["is_admin"] is True
