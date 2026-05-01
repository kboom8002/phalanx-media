# Phalanx 범용 플랫폼 구현 계획

## 실행 순서 (의존성 기반)

### Phase 1 — 멀티테넌트 기반 (이번 세션)
- [x] P1-1: `00005_multi_tenant.sql` — tenant_id 컬럼 + tenants 테이블
- [x] P1-2: `src/lib/tenant-config.ts` — 테넌트 설정 시스템
- [x] P1-3: `auth-context.tsx` 업데이트 — 테넌트 인식 RBAC
- [x] P1-4: 역할 라벨 커스텀화 (버티컬별 용어 자동 전환)

### Phase 2 — 코어 모듈 (이번 세션)
- [x] P2-1: Canon CMS (`/admin/canon`) — 리치 에디터 + 버전 관리
- [x] P2-2: AEO/GEO 대시보드 (`/admin/aeo`) — AI 인용률 추이
- [x] P2-3: AI 콘텐츠 변환기 API (`/api/transform-content`)
- [x] P2-4: 캐스케이드 자동화 강화 — 스케줄링 + 자동 포맷

### Phase 3 — 버티컬 가속기 (완료)
- [x] P3-1: 리드/전환 트래커 (`/media/leads`)
- [x] P3-2: 커뮤니티 게이미피케이션 (`/v-dash/badges`) — 배지·포인트·리더보드
- [x] P3-3: 구조화 데이터 엔진 (`/api/structured-data`) — Schema.org 자동 마크업

### Phase 4 — 네트워크 효과
- [ ] P4-1: 크로스 테넌트 Canon 신디케이션
- [ ] P4-2: 앰배서더/전문가 마켓플레이스
- [ ] P4-3: 통합 AEO 벤치마크 대시보드
