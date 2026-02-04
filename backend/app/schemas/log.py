from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class LogBase(BaseModel):
    timestamp: datetime
    severity: str = Field(..., pattern="^(INFO|WARNING|ERROR|CRITICAL)$")
    source_ip: str
    destination_ip: str
    source_port: Optional[int] = None
    destination_port: Optional[int] = None
    protocol: str
    action: str
    message: Optional[str] = None


class LogCreate(LogBase):
    pass


class LogRead(LogBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LogList(BaseModel):
    total: int
    items: List[LogRead]
    page: int
    page_size: int
    total_pages: int
