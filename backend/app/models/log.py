from sqlalchemy import Column, Integer, String, DateTime, Index
from datetime import datetime
from app.core.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    severity = Column(String(20), nullable=False, index=True)
    source_ip = Column(String(45), nullable=False, index=True)
    destination_ip = Column(String(45), nullable=False, index=True)
    source_port = Column(Integer, nullable=True)
    destination_port = Column(Integer, nullable=True)
    protocol = Column(String(10), nullable=False)
    action = Column(String(20), nullable=False)
    message = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index('idx_timestamp_severity', 'timestamp', 'severity'),
        Index('idx_source_dest_ip', 'source_ip', 'destination_ip'),
    )
