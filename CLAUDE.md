# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

방화벽 로그 모니터링 웹 어드민 페이지

### 기술 스택
- **프론트엔드**: Next.js + Tailwind CSS + JavaScript
- **백엔드**: Python FastAPI
- **데이터베이스**: SQLite

## 프로젝트 구조

```
module_3/
├── frontend/          # Next.js 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── app/      # Next.js App Router 페이지
│   │   ├── components/  # 재사용 가능한 React 컴포넌트
│   │   └── lib/      # 유틸리티 및 API 클라이언트
│   └── public/       # 정적 파일
├── backend/          # FastAPI 백엔드 애플리케이션
│   ├── app/
│   │   ├── api/      # API 라우트
│   │   ├── models/   # 데이터베이스 모델
│   │   ├── schemas/  # Pydantic 스키마
│   │   └── core/     # 설정 및 유틸리티
│   └── database/     # SQLite 데이터베이스 파일
└── docs/             # 프로젝트 문서
```

## 개발 명령어

### 프론트엔드 (Next.js)
```bash
cd frontend
npm install              # 의존성 설치
npm run dev             # 개발 서버 실행 (http://localhost:3000)
npm run build           # 프로덕션 빌드
npm run start           # 프로덕션 서버 실행
```

### 백엔드 (FastAPI)
```bash
cd backend
pip install -r requirements.txt  # 의존성 설치
uvicorn app.main:app --reload   # 개발 서버 실행 (http://localhost:8000)
uvicorn app.main:app --host 0.0.0.0 --port 8000  # 프로덕션 서버
```

### 데이터베이스
- SQLite 데이터베이스는 `backend/database/` 디렉토리에 저장됨
- 데이터베이스 초기화 및 마이그레이션은 FastAPI 애플리케이션 시작 시 자동으로 실행

## 주요 기능

1. **방화벽 로그 모니터링**: 실시간 방화벽 로그 조회 및 필터링
2. **로그 분석**: 로그 통계 및 시각화
3. **알림 설정**: 특정 이벤트 발생 시 알림 기능
4. **사용자 관리**: 관리자 계정 및 권한 관리

## API 엔드포인트

백엔드 API는 `/api/v1` 경로를 통해 접근:
- `/api/v1/logs` - 로그 관련 API
- `/api/v1/users` - 사용자 관련 API
- `/api/v1/settings` - 설정 관련 API

API 문서는 FastAPI 서버 실행 후 `http://localhost:8000/docs`에서 확인 가능

## 개발 가이드

### 프론트엔드
- Tailwind CSS를 사용한 스타일링
- Next.js App Router 사용
- API 호출은 `src/lib/api.js`의 클라이언트 사용

### 백엔드
- FastAPI의 비동기 처리 활용
- Pydantic을 사용한 데이터 검증
- SQLite ORM으로 데이터베이스 접근
