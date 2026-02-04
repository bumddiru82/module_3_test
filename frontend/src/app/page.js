'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import LogSeverityBadge from '@/components/LogSeverityBadge';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stats and recent logs in parallel
      const [statsData, logsData] = await Promise.all([
        api.getLogStats(),
        api.getLogs({ page: 1, page_size: 10 })
      ]);

      setStats(statsData);
      setRecentLogs(logsData.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert type="error" message={error} />
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-2">방화벽 로그 모니터링 시스템</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="전체 로그"
          value={stats?.total || 0}
          color="blue"
          icon="📊"
        />
        <StatCard
          title="위험 (Critical + Error)"
          value={(stats?.critical || 0) + (stats?.error || 0)}
          color="red"
          icon="🚨"
        />
        <StatCard
          title="경고 (Warning)"
          value={stats?.warning || 0}
          color="yellow"
          icon="⚠️"
        />
        <StatCard
          title="정보 (Info)"
          value={stats?.info || 0}
          color="green"
          icon="ℹ️"
        />
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">최근 로그</h2>
        </div>
        <div className="p-6">
          {recentLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              로그가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogSeverityBadge severity={log.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
                      <span>{new Date(log.timestamp).toLocaleString('ko-KR')}</span>
                      <span className="text-gray-400">|</span>
                      <span className="font-mono">{log.source_ip}</span>
                      <span>→</span>
                      <span className="font-mono">{log.destination_ip}</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      {log.message || `${log.protocol} ${log.action}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value.toLocaleString()}</span>
      </div>
      <div className="text-sm font-medium opacity-80">{title}</div>
    </div>
  );
}
