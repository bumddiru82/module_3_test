'use client';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
        <p className="text-gray-600 mt-2">시스템 사용자 및 권한 관리</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">👥</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            인증 시스템 구현 후 제공
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            사용자 관리 기능은 인증 시스템이 구현된 후에 사용할 수 있습니다.
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              예정된 기능
            </h3>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                사용자 계정 생성 및 삭제
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                권한 관리 (관리자/일반 사용자)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                비밀번호 변경
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                사용자 활동 로그
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-600">•</span>
                로그인 세션 관리
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
