# Vercel CI/CD 배포 가이드

## 1. GitHub → Vercel 연결 (최초 1회)

### phalanx-os
1. [vercel.com/new](https://vercel.com/new) → **Import Git Repository**
2. `kboom8002/phalanx-os` 선택
3. Framework: **Next.js** (자동 감지)
4. Root Directory: `.` (기본값)

### phalanx-media
1. 동일하게 `kboom8002/phalanx-media` import
2. Framework: **Next.js**

---

## 2. Vercel 환경 변수 설정

> Settings → Environment Variables 에서 각 프로젝트별 설정

### phalanx-os 환경 변수

| 변수명 | 값 | 환경 |
|:-------|:---|:-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qiahkjvfxmqhfcxbkpyz.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key) | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (service role key) | All |
| `OPENAI_API_KEY` | `sk-proj-...` | All |
| `CRON_SECRET` | `vqcp-agora-seed-2026` | All |
| `NEXT_PUBLIC_CRON_SECRET` | `vqcp-agora-seed-2026` | All |
| `PHALANX_MEDIA_URL` | `https://[phalanx-media-vercel-domain]` | Production |
| `KV_REST_API_URL` | Vercel KV URL (선택) | Production |
| `KV_REST_API_TOKEN` | Vercel KV Token (선택) | Production |

### phalanx-media 환경 변수

| 변수명 | 값 | 환경 |
|:-------|:---|:-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qiahkjvfxmqhfcxbkpyz.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (anon key) | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (service role key) | All |
| `OPENAI_API_KEY` | `sk-proj-...` | All |
| `CRON_SECRET` | `vqcp-agora-seed-2026` | All |

---

## 3. GitHub Actions Secrets 설정

> 각 레포 → Settings → Secrets and variables → Actions → New repository secret

### phalanx-os secrets
```
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
CRON_SECRET
TELEGRAM_BOT_TOKEN  (스크래퍼 크론 사용 시)
```

### phalanx-media secrets
```
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
CRON_SECRET
```

---

## 4. CI/CD 파이프라인 구조

```
GitHub push (master)
    │
    ├── Vercel: 자동 Preview 배포 (PR 단위)
    │                   ↓
    └── Vercel: 자동 Production 배포 (master merge)
                        ↓
              GitHub Actions (크론)
                        │
              ├── scraper.yml  (매시간 여론 수집)
              ├── crawler.yml  (매일 팩트 크롤링)
              └── ai_probe.yml (AI 검색 인텐트 분석)
```

---

## 5. 로컬 개발 시딩 실행

```powershell
# phalanx-media 서버 먼저 실행 (별도 터미널)
cd c:\Users\User\phalanx-media
npm run dev    # :3002 포트

# 시딩 실행
cd c:\Users\User\phalanx-os
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
node scripts/demo_seed.mjs
```

---

## 6. 향후 Git 브랜치 전략 (권장)

```
master  ──── 프로덕션 배포
  │
  ├── develop ──── 개발/스테이징
  │     │
  │     ├── feature/agora-dpo    (기능 개발)
  │     ├── feature/ai-copilot
  │     └── hotfix/...
```

```powershell
# 기능 개발 시
git checkout -b feature/기능명
# ... 작업 ...
git add -A
git commit -m "feat: 기능 설명"
git push origin feature/기능명
# GitHub에서 PR → master merge → Vercel 자동 배포
```
