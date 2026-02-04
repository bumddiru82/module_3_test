'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/DataTable';
import LogSeverityBadge from '@/components/LogSeverityBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  // Filters
  const [severityFilter, setSeverityFilter] = useState('');
  const [sourceIpFilter, setSourceIpFilter] = useState('');

  useEffect(() => {
    loadLogs();
  }, [page, severityFilter, sourceIpFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        page_size: 50,
      };

      if (severityFilter) params.severity = severityFilter;
      if (sourceIpFilter) params.source_ip = sourceIpFilter;

      const data = await api.getLogs(params);
      setLogs(data.items);
      setTotalPages(data.total_pages);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const columns = [
    {
      key: 'timestamp',
      label: '시간',
      render: (value) => new Date(value).toLocaleString('ko-KR'),
    },
    {
      key: 'severity',
      label: '심각도',
      render: (value) => <LogSeverityBadge severity={value} />,
    },
    {
      key: 'source_ip',
      label: '출발지 IP',
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'destination_ip',
      label: '목적지 IP',
      render: (value) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      key: 'protocol',
      label: '프로토콜',
    },
    {
      key: 'action',
      label: '동작',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'ALLOW'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'message',
      label: '메시지',
      render: (value) => (
        <span className="text-sm text-gray-600 truncate max-w-xs block">
          {value || '-'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">로그 모니터링</h1>
        <p className="text-gray-600 mt-2">
          전체 로그: {total.toLocaleString()}개
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              심각도
            </label>
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">전체</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="ERROR">ERROR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              출발지 IP
            </label>
            <input
              type="text"
              value={sourceIpFilter}
              onChange={(e) => setSourceIpFilter(e.target.value)}
              onBlur={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilterChange()}
              placeholder="예: 192.168.1.100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={() => {
              setSeverityFilter('');
              setSourceIpFilter('');
              setPage(1);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            필터 초기화
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && <Alert type="error" message={error} />}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <>
          {/* Data Table */}
          <DataTable columns={columns} data={logs} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              <span className="text-gray-700">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
