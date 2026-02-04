'use client';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">로그 분석</h1>
        <p className="text-gray-600 mt-2">고급 로그 분석 및 시각화</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">📈</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            분석 기능 준비 중
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            이 페이지는 추후 구현 예정입니다.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              예정된 기능
            </h3>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                시간대별 로그 발생 차트
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                출발지/목적지 IP 통계
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                프로토콜별 분포 분석
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                위협 패턴 분석
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                실시간 대시보드
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
