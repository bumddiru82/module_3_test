import pytest
from datetime import datetime
from pydantic import ValidationError

from app.schemas.log import LogCreate, LogRead, LogList


class TestLogSchemas:
    """Log schema validation tests"""

    def test_log_create_valid(self):
        """유효한 데이터로 LogCreate 스키마를 생성한다"""
        log_data = {
            "timestamp": datetime.utcnow(),
            "severity": "WARNING",
            "source_ip": "192.168.1.1",
            "destination_ip": "10.0.0.1",
            "source_port": 54321,
            "destination_port": 443,
            "protocol": "TCP",
            "action": "BLOCK",
            "message": "Test message"
        }

        log = LogCreate(**log_data)
        assert log.severity == "WARNING"
        assert log.source_ip == "192.168.1.1"
        assert log.protocol == "TCP"

    def test_log_create_valid_severities(self):
        """모든 유효한 심각도로 로그를 생성한다"""
        valid_severities = ["INFO", "WARNING", "ERROR", "CRITICAL"]

        for severity in valid_severities:
            log_data = {
                "timestamp": datetime.utcnow(),
                "severity": severity,
                "source_ip": "192.168.1.1",
                "destination_ip": "10.0.0.1",
                "protocol": "TCP",
                "action": "ALLOW"
            }
            log = LogCreate(**log_data)
            assert log.severity == severity

    def test_log_create_invalid_severity(self):
        """잘못된 심각도로 로그 생성시 유효성 검사 실패"""
        log_data = {
            "timestamp": datetime.utcnow(),
            "severity": "INVALID",
            "source_ip": "192.168.1.1",
            "destination_ip": "10.0.0.1",
            "protocol": "TCP",
            "action": "ALLOW"
        }

        with pytest.raises(ValidationError):
            LogCreate(**log_data)

    def test_log_create_missing_required_fields(self):
        """필수 필드 누락시 유효성 검사 실패"""
        log_data = {
            "timestamp": datetime.utcnow(),
            "severity": "INFO",
            # Missing required fields
        }

        with pytest.raises(ValidationError):
            LogCreate(**log_data)

    def test_log_create_optional_fields(self):
        """선택적 필드 없이 로그를 생성한다"""
        log_data = {
            "timestamp": datetime.utcnow(),
            "severity": "INFO",
            "source_ip": "192.168.1.1",
            "destination_ip": "10.0.0.1",
            "protocol": "TCP",
            "action": "ALLOW"
        }

        log = LogCreate(**log_data)
        assert log.source_port is None
        assert log.destination_port is None
        assert log.message is None

    def test_log_read_includes_id_and_timestamps(self):
        """LogRead 스키마는 ID와 타임스탬프를 포함한다"""
        log_data = {
            "id": 1,
            "timestamp": datetime.utcnow(),
            "severity": "INFO",
            "source_ip": "192.168.1.1",
            "destination_ip": "10.0.0.1",
            "protocol": "TCP",
            "action": "ALLOW",
            "created_at": datetime.utcnow()
        }

        log = LogRead(**log_data)
        assert log.id == 1
        assert hasattr(log, "created_at")

    def test_log_list_structure(self):
        """LogList 스키마가 올바른 구조를 가진다"""
        log_list_data = {
            "total": 10,
            "items": [
                {
                    "id": 1,
                    "timestamp": datetime.utcnow(),
                    "severity": "INFO",
                    "source_ip": "192.168.1.1",
                    "destination_ip": "10.0.0.1",
                    "protocol": "TCP",
                    "action": "ALLOW",
                    "created_at": datetime.utcnow()
                }
            ],
            "page": 1,
            "page_size": 50,
            "total_pages": 1
        }

        log_list = LogList(**log_list_data)
        assert log_list.total == 10
        assert len(log_list.items) == 1
        assert log_list.page == 1
        assert log_list.page_size == 50
        assert log_list.total_pages == 1

    def test_log_list_empty_items(self):
        """LogList는 빈 아이템 리스트를 가질 수 있다"""
        log_list_data = {
            "total": 0,
            "items": [],
            "page": 1,
            "page_size": 50,
            "total_pages": 0
        }

        log_list = LogList(**log_list_data)
        assert log_list.total == 0
        assert len(log_list.items) == 0
