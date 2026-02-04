import pytest
from httpx import AsyncClient


class TestHealthEndpoint:
    """Health check endpoint tests"""

    @pytest.mark.asyncio
    async def test_health_check_success(self, client: AsyncClient):
        """헬스체크 엔드포인트가 정상 응답을 반환한다"""
        response = await client.get("/api/v1/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "database" in data
        assert "app_name" in data
        assert "version" in data
        assert "debug" in data

    @pytest.mark.asyncio
    async def test_health_check_database_status(self, client: AsyncClient):
        """헬스체크가 데이터베이스 연결 상태를 확인한다"""
        response = await client.get("/api/v1/health")

        assert response.status_code == 200
        data = response.json()
        assert data["database"] in ["connected", "disconnected"]

    @pytest.mark.asyncio
    async def test_health_check_response_structure(self, client: AsyncClient):
        """헬스체크 응답이 올바른 구조를 가진다"""
        response = await client.get("/api/v1/health")

        assert response.status_code == 200
        data = response.json()

        required_fields = ["status", "database", "app_name", "version", "debug"]
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
