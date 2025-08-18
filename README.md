# [ME:LOG](https://melog-ai.vercel.app) - 감정 회고 서비스

ME:LOG는 사용자가 음성 또는 텍스트로 하루의 감정을 기록하고 되돌아볼 수 있는 감정 회고 서비스입니다.

## 🛠 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- Zustand
- lottie-react
- ESLint + Prettier
- Husky + lint-staged

#### 모노레포 구조

- `apps/web`: 메인 웹 애플리케이션
- `packages/shared`: 공통 비즈니스 로직, 상수, 타입
- `packages/ui`: 재사용 가능한 UI 컴포넌트

## 📁 프로젝트 구조

```
melog-fe/
├── apps/
│   └── web/                    # 메인 웹 애플리케이션
│       ├── src/
│       │   ├── app/           # Next.js App Router
│       │   │   ├── emotion/   # 감정 기록 관련 페이지
│       │   │   ├── feed/      # 피드 페이지
│       │   │   ├── calendar/  # 캘린더 페이지
│       │   │   ├── profile/   # 프로필 페이지
│       │   │   └── onboarding/ # 온보딩 페이지
│       │   ├── components/    # 공통 컴포넌트
│       │   ├── features/      # 기능별 컴포넌트
│       │   ├── shared/        # 공유 유틸리티
│       │   └── assets/        # SVG, 이미지 등
│       └── public/            # 정적 파일
├── packages/
│   ├── shared/               # 공유 라이브러리
│   │   ├── constants/        # 상수 정의
│   │   ├── entities/         # 타입 정의
│   │   ├── hooks/           # 공통 훅
│   │   ├── services/        # 공통 서비스
│   │   └── store/           # 상태 관리
│   └── ui/                   # UI 컴포넌트 라이브러리
│       ├── Button/           # 버튼 컴포넌트
│       ├── Layout/           # 레이아웃 컴포넌트
│       └── assets/           # SVG 아이콘들
└── turbo.json               # Turbo 설정
```

## 📝 How To Use

```bash
# Nodejs 18 이상

# 개발 서버 실행
npm run dev
# 프로덕션 빌드
npm run build
# 린트 검사
npm run lint
# 린트 자동 수정
npm run lint:fix
# 타입 체크
npm run type-check
# 코드 포맷팅
npm run format
# 테스트 실행
npm run test
```

## 🚀 주요 기능

- **감정 기록**: 5가지 감정(빨간색, 노란색, 초록색, 파란색, 회색)과 강도를 선택하여 기록
- **다양한 입력 방식**: 음성 녹음, 텍스트 입력
- **AI 분석**: 입력된 내용을 바탕으로 감정 분석 결과 제공
- **피드 시스템**: 다른 사용자들의 감정 기록 공유 및 조회
- **캘린더 뷰**: 날짜별 감정 기록 확인
- **프로필 관리**: 개인 프로필 및 설정 관리

## 📱 주요 페이지

1. **온보딩** (`/onboarding`): 초기 사용자 안내
2. **감정 기록** (`/emotion`): 감정 선택 및 기록
3. **피드** (`/feed`): 감정 기록 공유 및 조회
4. **캘린더** (`/calendar`): 날짜별 감정 기록 확인
5. **프로필** (`/profile`): 사용자 프로필 관리
