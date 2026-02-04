import pytest
from httpx import AsyncClient
from datetime import datetime
from databases import Database


class TestLogsEndpoints:
    """Logs API endpoint tests"""

    @pytest.fixture
    async def sample_log(self, database: Database):
        """테스트용 샘플 로그 데이터 생성"""
        query = """
            INSERT INTO logs (timestamp, severity, source_ip, destination_ip,
                            source_port, destination_port, protocol, action, message, created_at)
            VALUES (:timestamp, :severity, :source_ip, :destination_ip,
                    :source_port, :destination_port, :protocol, :action, :message, :created_at)
        """
        log_data = {
            "timestamp": datetime.utcnow(),
            "severity": "WARNING",
            "source_ip": "192.168.1.100",
            "destination_ip": "10.0.0.1",
            "source_port": 54321,
            "destination_port": 443,
            "protocol": "TCP",
            "action": "BLOCK",
            "message": "Suspicious activity detected",
            "created_at": datetime.utcnow()
        }

        log_id = await database.execute(query, log_data)
        return log_id

    @pytest.mark.asyncio
    async def test_get_logs_empty(self, client: AsyncClient):
        """로그가 없을 때 빈 리스트를 반환한다"""
        response = await client.get("/api/v1/logs")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["items"] == []
        assert data["page"] == 1
        assert data["total_pages"] == 0

    @pytest.mark.asyncio
    async def test_get_logs_with_data(self, client: AsyncClient, sample_log: int):
        """로그가 있을 때 데이터를 반환한다"""
        response = await client.get("/api/v1/logs")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["id"] == sample_log

    @pytest.mark.asyncio
    async def test_get_logs_pagination(self, client: AsyncClient, database: Database):
        """페이지네이션이 올바르게 작동한다"""
        # Create multiple logs
        for i in range(15):
            query = """
                INSERT INTO logs (timestamp, severity, source_ip, destination_ip,
                                protocol, action, created_at)
                VALUES (:timestamp, :severity, :source_ip, :destination_ip,
                        :protocol, :action, :created_at)
            """
            await database.execute(query, {
                "timestamp": datetime.utcnow(),
                "severity": "INFO",
                "source_ip": f"192.168.1.{i}",
                "destination_ip": "10.0.0.1",
                "protocol": "TCP",
                "action": "ALLOW",
                "created_at": datetime.utcnow()
            })

        # Test page 1
        response = await client.get("/api/v1/logs?page=1&page_size=10")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 15
        assert len(data["items"]) == 10
        assert data["page"] == 1
        assert data["total_pages"] == 2

        # Test page 2
        response = await client.get("/api/v1/logs?page=2&page_size=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 5
        assert data["page"] == 2

    @pytest.mark.asyncio
    async def test_get_logs_filter_by_severity(self, client: AsyncClient, database: Database):
        """심각도로 로그를 필터링한다"""
        # Create logs with different severities
        for severity in ["INFO", "WARNING", "ERROR", "CRITICAL"]:
            query = """
                INSERT INTO logs (timestamp, severity, source_ip, destination_ip,
                                protocol, action, created_at)
                VALUES (:timestamp, :severity, :source_ip, :destination_ip,
                        :protocol, :action, :created_at)
            """
            await database.execute(query, {
                "timestamp": datetime.utcnow(),
                "severity": severity,
                "source_ip": "192.168.1.1",
                "destination_ip": "10.0.0.1",
                "protocol": "TCP",
                "action": "ALLOW",
                "created_at": datetime.utcnow()
            })

        response = await client.get("/api/v1/logs?severity=WARNING")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["severity"] == "WARNING"

    @pytest.mark.asyncio
    async def test_get_logs_filter_by_source_ip(self, client: AsyncClient, database: Database):
        """소스 IP로 로그를 필터링한다"""
        # Create logs with different IPs
        for i in range(3):
            query = """
                INSERT INTO logs (timestamp, severity, source_ip, destination_ip,
                                protocol, action, created_at)
                VALUES (:timestamp, :severity, :source_ip, :destination_ip,
                        :protocol, :action, :created_at)
            """
            await database.execute(query, {
                "timestamp": datetime.utcnow(),
                "severity": "INFO",
                "source_ip": f"192.168.1.{i}",
                "destination_ip": "10.0.0.1",
                "protocol": "TCP",
                "action": "ALLOW",
                "created_at": datetime.utcnow()
            })

        response = await client.get("/api/v1/logs?source_ip=192.168.1.1")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["source_ip"] == "192.168.1.1"

    @pytest.mark.asyncio
    async def test_get_log_by_id(self, client: AsyncClient, sample_log: int):
        """ID로 특정 로그를 조회한다"""
        response = await client.get(f"/api/v1/logs/{sample_log}")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_log
        assert data["severity"] == "WARNING"
        assert data["source_ip"] == "192.168.1.100"

    @pytest.mark.asyncio
    async def test_get_log_by_id_not_found(self, client: AsyncClient):
        """존재하지 않는 로그 조회시 404를 반환한다"""
        response = await client.get("/api/v1/logs/99999")

        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    @pytest.mark.asyncio
    async def test_create_log(self, client: AsyncClient):
        """새로운 로그를 생성한다"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "severity": "ERROR",
            "source_ip": "192.168.1.50",
            "destination_ip": "10.0.0.5",
            "source_port": 12345,
            "destination_port": 80,
            "protocol": "HTTP",
            "action": "BLOCK",
            "message": "Test log entry"
        }

        response = await client.post("/api/v1/logs", json=log_data)

        assert response.status_code == 201
        data = response.json()
        assert data["severity"] == "ERROR"
        assert data["source_ip"] == "192.168.1.50"
        assert "id" in data
        assert "created_at" in data

    @pytest.mark.asyncio
    async def test_create_log_invalid_severity(self, client: AsyncClient):
        """잘못된 심각도로 로그 생성시 유효성 검사 실패"""
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "severity": "INVALID",
            "source_ip": "192.168.1.50",
            "destination_ip": "10.0.0.5",
            "protocol": "HTTP",
            "action": "BLOCK"
        }

        response = await client.post("/api/v1/logs", json=log_data)

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_log_stats(self, client: AsyncClient, database: Database):
        """로그 통계를 조회한다"""
        # Create logs with different severities
        severities = ["CRITICAL", "CRITICAL", "ERROR", "WARNING", "INFO"]
        for severity in severities:
            query = """
                INSERT INTO logs (timestamp, severity, source_ip, destination_ip,
                                protocol, action, created_at)
                VALUES (:timestamp, :severity, :source_ip, :destination_ip,
                        :protocol, :action, :created_at)
            """
            await database.execute(query, {
                "timestamp": datetime.utcnow(),
                "severity": severity,
                "source_ip": "192.168.1.1",
                "destination_ip": "10.0.0.1",
                "protocol": "TCP",
                "action": "ALLOW",
                "created_at": datetime.utcnow()
            })

        response = await client.get("/api/v1/logs/stats/summary")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 5
        assert data["critical"] == 2
        assert data["error"] == 1
        assert data["warning"] == 1
        assert data["info"] == 1

    @pytest.mark.asyncio
    async def test_get_log_stats_empty(self, client: AsyncClient):
        """로그가 없을 때 통계는 모두 0이다"""
        response = await client.get("/api/v1/logs/stats/summary")

        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 0
        assert data["critical"] == 0
        assert data["error"] == 0
        assert data["warning"] == 0
        assert data["info"] == 0
