import pytest
from datetime import datetime
from pydantic import ValidationError

from app.schemas.user import UserBase, UserCreate, UserUpdate, UserRead


class TestUserSchemas:
    """User schema validation tests"""

    def test_user_base_valid(self):
        """유효한 데이터로 UserBase 스키마를 생성한다"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User"
        }

        user = UserBase(**user_data)
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.full_name == "Test User"

    def test_user_base_optional_full_name(self):
        """full_name은 선택적 필드이다"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com"
        }

        user = UserBase(**user_data)
        assert user.username == "testuser"
        assert user.full_name is None

    def test_user_base_invalid_email(self):
        """잘못된 이메일 형식으로 유효성 검사 실패"""
        user_data = {
            "username": "testuser",
            "email": "invalid-email",
            "full_name": "Test User"
        }

        with pytest.raises(ValidationError):
            UserBase(**user_data)

    def test_user_base_username_min_length(self):
        """username은 최소 3글자여야 한다"""
        user_data = {
            "username": "ab",
            "email": "test@example.com"
        }

        with pytest.raises(ValidationError):
            UserBase(**user_data)

    def test_user_base_username_max_length(self):
        """username은 최대 50글자여야 한다"""
        user_data = {
            "username": "a" * 51,
            "email": "test@example.com"
        }

        with pytest.raises(ValidationError):
            UserBase(**user_data)

    def test_user_create_with_password(self):
        """UserCreate는 비밀번호를 포함한다"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "securepassword123"
        }

        user = UserCreate(**user_data)
        assert user.password == "securepassword123"

    def test_user_create_password_min_length(self):
        """비밀번호는 최소 8글자여야 한다"""
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "short"
        }

        with pytest.raises(ValidationError):
            UserCreate(**user_data)

    def test_user_update_all_optional(self):
        """UserUpdate의 모든 필드는 선택적이다"""
        user_data = {}

        user = UserUpdate(**user_data)
        assert user.email is None
        assert user.full_name is None
        assert user.password is None
        assert user.is_active is None

    def test_user_update_partial(self):
        """UserUpdate는 일부 필드만 업데이트할 수 있다"""
        user_data = {
            "email": "newemail@example.com"
        }

        user = UserUpdate(**user_data)
        assert user.email == "newemail@example.com"
        assert user.full_name is None

    def test_user_update_password_min_length(self):
        """업데이트 시에도 비밀번호는 최소 8글자여야 한다"""
        user_data = {
            "password": "short"
        }

        with pytest.raises(ValidationError):
            UserUpdate(**user_data)

    def test_user_read_complete_structure(self):
        """UserRead는 모든 사용자 정보를 포함한다"""
        user_data = {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "full_name": "Test User",
            "is_active": True,
            "is_admin": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        user = UserRead(**user_data)
        assert user.id == 1
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.is_admin is False
        assert hasattr(user, "created_at")
        assert hasattr(user, "updated_at")

    def test_user_read_boolean_fields(self):
        """UserRead의 불린 필드가 올바르게 작동한다"""
        user_data = {
            "id": 1,
            "username": "admin",
            "email": "admin@example.com",
            "is_active": True,
            "is_admin": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        user = UserRead(**user_data)
        assert isinstance(user.is_active, bool)
        assert isinstance(user.is_admin, bool)
        assert user.is_active is True
        assert user.is_admin is True
