import pytest
from httpx import AsyncClient


class TestMainEndpoints:
    """Main application endpoint tests"""

    @pytest.mark.asyncio
    async def test_root_endpoint(self, client: AsyncClient):
        """루트 엔드포인트가 애플리케이션 정보를 반환한다"""
        response = await client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "app" in data
        assert "version" in data
        assert "docs" in data
        assert "health" in data

    @pytest.mark.asyncio
    async def test_root_endpoint_structure(self, client: AsyncClient):
        """루트 엔드포인트 응답이 올바른 구조를 가진다"""
        response = await client.get("/")

        assert response.status_code == 200
        data = response.json()

        required_fields = ["app", "version", "docs", "health"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"

    @pytest.mark.asyncio
    async def test_root_endpoint_values(self, client: AsyncClient):
        """루트 엔드포인트가 올바른 경로 정보를 제공한다"""
        response = await client.get("/")

        assert response.status_code == 200
        data = response.json()

        assert data["docs"] == "/docs"
        assert data["health"] == "/api/v1/health"
