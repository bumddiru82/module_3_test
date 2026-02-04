'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">시스템 설정</h1>
        <p className="text-gray-600 mt-2">시스템 환경 설정 및 관리</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚙️</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            설정 기능 준비 중
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
                알림 설정 (이메일, 웹훅)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                로그 보관 정책 설정
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                자동 백업 설정
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                모니터링 임계값 설정
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                시스템 성능 설정
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
