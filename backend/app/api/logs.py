from fastapi import APIRouter, Depends, HTTPException, Query
from databases import Database
from typing import Optional
from datetime import datetime
import math

from app.core.database import get_database
from app.schemas.log import LogCreate, LogRead, LogList

router = APIRouter()


@router.get("/logs", response_model=LogList)
async def get_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    severity: Optional[str] = None,
    source_ip: Optional[str] = None,
    db: Database = Depends(get_database)
):
    """
    Get paginated logs with optional filtering
    """
    # Build query
    where_clauses = []
    values = {}

    if severity:
        where_clauses.append("severity = :severity")
        values["severity"] = severity

    if source_ip:
        where_clauses.append("source_ip = :source_ip")
        values["source_ip"] = source_ip

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    # Count total
    count_query = f"SELECT COUNT(*) as total FROM logs {where_sql}"
    total_result = await db.fetch_one(count_query, values)
    total = total_result["total"] if total_result else 0

    # Calculate pagination
    offset = (page - 1) * page_size
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    # Fetch logs
    logs_query = f"""
        SELECT id, timestamp, severity, source_ip, destination_ip,
               source_port, destination_port, protocol, action, message, created_at
        FROM logs
        {where_sql}
        ORDER BY timestamp DESC
        LIMIT :limit OFFSET :offset
    """
    values.update({"limit": page_size, "offset": offset})

    logs = await db.fetch_all(logs_query, values)

    return {
        "total": total,
        "items": logs,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.get("/logs/{log_id}", response_model=LogRead)
async def get_log(log_id: int, db: Database = Depends(get_database)):
    """
    Get a specific log by ID
    """
    query = """
        SELECT id, timestamp, severity, source_ip, destination_ip,
               source_port, destination_port, protocol, action, message, created_at
        FROM logs
        WHERE id = :log_id
    """
    log = await db.fetch_one(query, {"log_id": log_id})

    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    return log


@router.post("/logs", response_model=LogRead, status_code=201)
async def create_log(log: LogCreate, db: Database = Depends(get_database)):
    """
    Create a new log entry (for testing purposes)
    """
    query = """
        INSERT INTO logs (timestamp, severity, source_ip, destination_ip,
                         source_port, destination_port, protocol, action, message, created_at)
        VALUES (:timestamp, :severity, :source_ip, :destination_ip,
                :source_port, :destination_port, :protocol, :action, :message, :created_at)
    """
    values = {
        **log.model_dump(),
        "created_at": datetime.utcnow()
    }

    log_id = await db.execute(query, values)

    # Fetch created log
    created_log = await db.fetch_one(
        "SELECT * FROM logs WHERE id = :log_id",
        {"log_id": log_id}
    )

    return created_log


@router.get("/logs/stats/summary")
async def get_log_stats(db: Database = Depends(get_database)):
    """
    Get log statistics for dashboard
    Returns counts by severity
    """
    query = """
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
            SUM(CASE WHEN severity = 'ERROR' THEN 1 ELSE 0 END) as error,
            SUM(CASE WHEN severity = 'WARNING' THEN 1 ELSE 0 END) as warning,
            SUM(CASE WHEN severity = 'INFO' THEN 1 ELSE 0 END) as info
        FROM logs
    """

    result = await db.fetch_one(query)

    if not result:
        return {
            "total": 0,
            "critical": 0,
            "error": 0,
            "warning": 0,
            "info": 0
        }

    return {
        "total": result["total"] or 0,
        "critical": result["critical"] or 0,
        "error": result["error"] or 0,
        "warning": result["warning"] or 0,
        "info": result["info"] or 0
    }
