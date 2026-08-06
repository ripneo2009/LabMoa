# Eumlab frontend

`eumlab-main`의 기존 UI/UX를 유지하면서 PostgreSQL/Prisma 데이터 계층만 Cloud Firestore로 교체한 Next.js 15 애플리케이션입니다. 화면, 반응형 스타일, Kakao Maps, OpenAlex 논문 동기화, JWT 쿠키 인증 흐름을 유지하며 Firebase Google 로그인을 추가했습니다.

> 제공된 `eumlab-main`에는 Gemini SDK, API route, 환경 변수, 호출 코드가 없습니다. 따라서 Gemini 동작은 변경하거나 새로 추정해 추가하지 않았습니다.

## 구조

```text
frontend/
├─ firebase/
│  ├─ firestore.indexes.json
│  └─ firestore.rules
├─ scripts/
│  ├─ migrate-prisma-to-firestore.ts
│  └─ seed-firestore.ts
├─ src/
│  ├─ app/                    # App Router 페이지와 API routes
│  ├─ components/             # 기존 UI, 기능별 컴포넌트
│  ├─ data/seed/              # 기존 데모 데이터(네이티브 배열)
│  ├─ hooks/
│  ├─ lib/
│  │  ├─ actions/             # 인증/소유권 확인 후 쓰기 수행
│  │  ├─ auth/                # 기존 JWT cookie + bcrypt
│  │  ├─ config/              # public/server 환경 설정
│  │  ├─ domain/              # 순수 비즈니스 규칙과 단위 테스트
│  │  ├─ external/            # Kakao Maps, OpenAlex
│  │  ├─ firebase/            # Admin SDK 초기화
│  │  ├─ queries/             # 페이지용 읽기 use cases
│  │  ├─ repositories/        # 유일한 Firestore 접근 계층
│  │  └─ utils/
│  └─ types/
├─ .env.example
└─ firebase.json
```

React 컴포넌트와 페이지는 Firestore를 직접 import하지 않습니다. 서버 action/API route → repository 방향으로만 의존합니다. Firebase Admin SDK가 서버에서만 동작하므로 서비스 계정과 비밀번호 해시는 브라우저 번들에 포함되지 않습니다.

## Firestore 데이터 모델

| Collection | 핵심 필드 | 관계/용도 |
|---|---|---|
| `users` | `role`, `name`, `email`, `emailNormalized`, nullable `passwordHash`, nullable `googleUid`, `org`, `phone`, timestamps | 이메일/Google 로그인 계정. 기존 이메일과 Google 이메일이 같으면 같은 문서에 연결 |
| `labs` | 위치, `region`, native array인 `fieldTags`/`equipment`, 요금, 안전 수준, OpenAlex ID | 연구실 검색의 기준 aggregate |
| `mentors` | `userId`, `labId`, 학위/분야/소개/키워드 | user와 lab을 ID로 연결 |
| `papers` | `labId`, 논문 메타데이터, `publishedAt`, `doi`, native `tags` | OpenAlex 캐시 |
| `proposals` | `studentId`, `labId`, `mentorId`, 계획 내용, native 재료/장비 배열, 상태/버전, timestamps | 계획서 aggregate |
| `reviewNotes` | `proposalId`, `authorId`, 대상 필드/심각도/내용, `createdAt` | 계획서 검토 의견 |
| `bookings` | `proposalId`, denormalized `labId`/`studentId`, 날짜/시간/비용/상태 | lab/date 충돌 및 학생별 조회 지원 |
| `messages` | `proposalId`, `senderId`, 내용, `createdAt` | 계획서별 채팅 |

날짜는 Firestore `Timestamp`, 배열은 Firestore native array, 금액은 integer number입니다. 관계 삭제 cascade는 자동 실행하지 않습니다. 현재 UI에 삭제 흐름이 없고, 향후 추가 시 repository에서 batch/transaction으로 명시해야 합니다.

필요한 composite index는 [firebase/firestore.indexes.json](firebase/firestore.indexes.json)에 선언되어 있습니다. 애플리케이션 세션은 기존 JWT/httpOnly cookie 방식입니다. 이메일 로그인은 기존 bcrypt 검증을 유지하고, Google 로그인만 Firebase Authentication에서 받은 ID token을 Admin SDK로 검증한 뒤 동일한 서버 세션을 발급합니다. 파일 업로드 기능은 없어 Cloud Storage를 추가하지 않았습니다.

## Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 프로젝트를 만듭니다.
2. Build → Firestore Database → Create database에서 database를 생성합니다. 운영 환경에서는 Production mode를 선택합니다.
3. Project settings → Service accounts → Generate new private key로 서버용 service account JSON을 발급합니다. 파일 자체를 저장소에 넣지 말고 값을 로컬 환경 변수/배포 플랫폼 secret에 넣습니다.
4. Project settings → General → Your apps의 Web app 설정은 `NEXT_PUBLIC_FIREBASE_*` 변수에 입력합니다. 이 값들은 브라우저 식별자이며 Admin 서비스 계정 자격 증명을 대신하지 않습니다.
5. Build → Authentication → Sign-in method에서 Google provider를 활성화하고 지원 이메일을 선택합니다.
6. Authentication → Settings → Authorized domains에 `localhost`와 실제 배포 도메인을 등록합니다.
7. Firebase CLI로 rules와 indexes를 배포합니다.

```bash
npx firebase-tools login
npx firebase-tools use --add
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

현재 rules는 모든 클라이언트 read/write를 거부합니다. 기존 앱이 서버 action/API와 Admin SDK만 사용하기 때문에 의도된 설정이며, Admin SDK 요청은 rules 평가 대상이 아닙니다.

## Windows PowerShell 로컬 실행

```powershell
Set-Location .\frontend
npm install
Copy-Item .env.example .env.local
# .env.local의 FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
# FIREBASE_PRIVATE_KEY, AUTH_SECRET, NEXT_PUBLIC_KAKAO_MAP_KEY를 입력
npm run firebase:seed
npm run dev
```

`AUTH_SECRET` 생성 예:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

에뮬레이터를 쓰려면 별도 터미널에서 실행한 뒤 `.env.local`에 `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`을 설정합니다.

```powershell
npx firebase-tools emulators:start --only firestore
```

## Ubuntu 로컬 실행

```bash
cd frontend
npm install
cp .env.example .env.local
# 편집기로 Firebase/Auth/Kakao 값을 입력
npm run firebase:seed
npm run dev
```

`AUTH_SECRET` 생성 및 Firestore emulator 실행:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
npx firebase-tools emulators:start --only firestore
```

브라우저에서 `http://localhost:3000`을 엽니다. Kakao JavaScript key는 브라우저 SDK 특성상 공개 값이며 Kakao Developers 콘솔에서 허용 도메인(`http://localhost:3000`, 운영 도메인)을 제한해야 합니다. OpenAlex 연동에는 별도 key가 필요하지 않습니다.

## 기존 PostgreSQL 데이터 이전

이전 스크립트는 PostgreSQL을 읽고 동일 ID로 Firestore에 merge합니다. 원본 DB를 수정하거나 삭제하지 않지만, 대상 Firestore 문서는 같은 ID일 경우 갱신되므로 먼저 양쪽을 백업하십시오.

```powershell
# Windows PowerShell
$env:LEGACY_DATABASE_URL="postgresql://..."
$env:CONFIRM_FIRESTORE_MIGRATION="yes"
npm run firebase:migrate
```

```bash
# Ubuntu
export LEGACY_DATABASE_URL='postgresql://...'
export CONFIRM_FIRESTORE_MIGRATION=yes
npm run firebase:migrate
```

스크립트는 Prisma JSON 문자열 배열을 native arrays로 변환하고, timestamp와 기존 document ID를 보존하며, booking에 `labId`/`studentId`를 보강합니다. 실제 운영 DB에는 실행하지 않았습니다.

## 검증 명령

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

실제 Firebase/Kakao/OpenAlex 통합 검증에는 유효한 외부 자격 증명과 네트워크가 필요합니다. 데모 seed 계정의 공통 비밀번호는 기존과 동일한 `eumlab1234`입니다.
