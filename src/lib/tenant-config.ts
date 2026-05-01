/**
 * 테넌트 설정 시스템
 * 버티컬별 역할 라벨, 기능 토글, 테마를 관리합니다.
 * 환경변수 NEXT_PUBLIC_TENANT_ID로 현재 테넌트를 결정합니다.
 */

type Role = 'SYSOP' | 'PRINCIPAL' | 'EXPERT' | 'STRATEGIST' | 'REGION_LEAD' | 'ACTIVIST' | 'CITIZEN';

export type Vertical = 'politics' | 'sales' | 'media' | 'education' | 'community';

export interface TenantConfig {
  id: string;
  displayName: string;
  vertical: Vertical;
  domain: string | null;
  logoUrl: string | null;

  roleLabels: Record<Role, string>;

  theme: {
    primaryColor: string;
    accentColor: string;
    selectionColor: string;
  };

  features: {
    cascade: boolean;
    aeo_tracking: boolean;
    canon_cms: boolean;
    gamification: boolean;
    lead_tracker: boolean;
    structured_data: boolean;
  };

  /** 버티컬별 용어 변환 */
  terminology: {
    canon: string;         // "공식 입장" / "세일즈 스크립트" / "에디토리얼"
    signal: string;        // "여론 신호" / "고객 VOC" / "트렌드 버즈"
    quest: string;         // "활동 과제" / "영업 미션" / "학습 과제"
    agora: string;         // "공론장" / "고객 후기" / "Q&A 게시판"
    cascade: string;       // "소셜 배포" / "소셜 셀링" / "학습 인증"
    principal: string;     // "정치인 대시보드" / "본사 대시보드"
  };

  /** 미디어 홈 Hero 다형성 텍스트 */
  media: {
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    canonTitle: string;
    canonSubtitle: string;
  };

  /** 테넌트 맞춤형 데이터 수집 파이프라인 (Phase 6) */
  pipelineConfig: {
    sources: Array<{
      type: 'news' | 'dcinside' | 'instagram' | 'hwahae' | 'oliveyoung' | 'crm_webhook' | 'youtube' | 'custom';
      keywords?: string[];
      hashtags?: string[];
      category?: string;
      endpoint?: string;
    }>;
    frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  };

  aeoKeywords: string[];
  aeoCompetitors: string[];
}

// ── 프리셋 테넌트 설정 ─────────────────────────────────────────
const TENANT_PRESETS: Record<string, TenantConfig> = {
  phalanx: {
    id: 'phalanx',
    displayName: '팔랑크스 정치 OS',
    vertical: 'politics',
    domain: 'phalanx-os.vercel.app',
    logoUrl: null,
    roleLabels: {
      SYSOP: '시스템 운영자', PRINCIPAL: '정치인 (본인)', EXPERT: '전문가·명사',
      STRATEGIST: '전략 참모', REGION_LEAD: '지역 조직장', ACTIVIST: '활동 참여자', CITIZEN: '일반 시민',
    },
    theme: { primaryColor: '#3b82f6', accentColor: '#8b5cf6', selectionColor: 'rgba(59,130,246,0.3)' },
    features: { cascade: true, aeo_tracking: true, canon_cms: true, gamification: true, lead_tracker: false, structured_data: false },
    terminology: {
      canon: '공식 입장', signal: '여론 신호', quest: '활동 과제',
      agora: '공론장', cascade: '소셜 배포', principal: '정치인 대시보드',
    },
    media: {
      heroTitle: '감정에 흔들리지 않고, 오직 데이터와 사실로 응답합니다.',
      heroSubtitle: '궁금한 논란, 부상하는 의제, 그리고 가짜 뉴스에 대한 본부의 공식적인 입장을 가장 먼저 확인하세요.',
      searchPlaceholder: '의혹, 키워드, 정책 이름을 검색해 보세요...',
      canonTitle: '국가전략 노트',
      canonSubtitle: '국가 운영의 굵직한 철학과 구체적 정책 대안을 매주 공개합니다.',
    },
    pipelineConfig: {
      sources: [
        { type: 'news', keywords: ['당정분리', '저출산'] },
        { type: 'dcinside', keywords: ['politics'] }
      ],
      frequency: 'hourly'
    },
    aeoKeywords: [], aeoCompetitors: [],
  },
  aihompy: {
    id: 'aihompy',
    displayName: 'AI홈피 영업 네트워크',
    vertical: 'sales',
    domain: null,
    logoUrl: null,
    roleLabels: {
      SYSOP: '시스템 관리자', PRINCIPAL: '본사 대표', EXPERT: '제품 전문가',
      STRATEGIST: '영업 기획팀', REGION_LEAD: '지역 총판', ACTIVIST: '영업 사원', CITIZEN: '잠재 고객',
    },
    theme: { primaryColor: '#f59e0b', accentColor: '#ef4444', selectionColor: 'rgba(245,158,11,0.3)' },
    features: { cascade: true, aeo_tracking: true, canon_cms: true, gamification: true, lead_tracker: true, structured_data: true },
    terminology: {
      canon: '세일즈 스크립트', signal: '고객 VOC', quest: '영업 미션',
      agora: '고객 후기', cascade: '소셜 셀링', principal: '본사 대시보드',
    },
    media: {
      heroTitle: '검증된 성분 정보만, 오직 데이터로 증명합니다.',
      heroSubtitle: '고객 VOC와 성분 분석 데이터를 기반으로 한 공식 제품 정보를 확인하세요.',
      searchPlaceholder: '성분, 제품명, 브랜드를 검색해 보세요...',
      canonTitle: '세일즈 스크립트 라이브러리',
      canonSubtitle: '검증된 영업 스크립트와 제품 Q&A를 매주 업데이트합니다.',
    },
    pipelineConfig: {
      sources: [
        { type: 'crm_webhook', endpoint: 'active' }
      ],
      frequency: 'realtime'
    },
    aeoKeywords: [], aeoCompetitors: [],
  },
  kskincare: {
    id: 'kskincare',
    displayName: 'K-Skincare 미디어',
    vertical: 'media',
    domain: null,
    logoUrl: null,
    roleLabels: {
      SYSOP: '기술 관리자', PRINCIPAL: '편집장', EXPERT: '뷰티 칼럼니스트',
      STRATEGIST: '에디터', REGION_LEAD: '앰배서더 리더', ACTIVIST: '앰배서더', CITIZEN: '독자',
    },
    theme: { primaryColor: '#ec4899', accentColor: '#f43f5e', selectionColor: 'rgba(236,72,153,0.3)' },
    features: { cascade: true, aeo_tracking: true, canon_cms: true, gamification: true, lead_tracker: false, structured_data: true },
    terminology: {
      canon: '에디토리얼', signal: '트렌드 버즈', quest: '리뷰 미션',
      agora: '뷰티 토론', cascade: '콘텐츠 공유', principal: '편집장 대시보드',
    },
    media: {
      heroTitle: '성분으로 증명하고, 데이터로 안심합니다.',
      heroSubtitle: '한국 비건 뷰티의 최신 트렌드와 성분 분석을 전달합니다.',
      searchPlaceholder: '성분명, 효능, 브랜드를 검색해 보세요...',
      canonTitle: '에디토리얼 라이브러리',
      canonSubtitle: '클린 스킨 시대의 에디토리얼을 매주 구독하세요.',
    },
    pipelineConfig: {
      sources: [
        { type: 'instagram', hashtags: ['#비건화장품', '#바쿠치올'] },
        { type: 'oliveyoung', category: 'skincare' }
      ],
      frequency: 'daily'
    },
    aeoKeywords: [], aeoCompetitors: [],
  },
  tfstudio: {
    id: 'tfstudio',
    displayName: 'TF-Studio 학습 커뮤니티',
    vertical: 'education',
    domain: null,
    logoUrl: null,
    roleLabels: {
      SYSOP: '기술 관리자', PRINCIPAL: '학원장', EXPERT: '강사·멘토',
      STRATEGIST: '커리큘럼 기획자', REGION_LEAD: '반장', ACTIVIST: '수강생', CITIZEN: '체험 수강생',
    },
    theme: { primaryColor: '#10b981', accentColor: '#06b6d4', selectionColor: 'rgba(16,185,129,0.3)' },
    features: { cascade: true, aeo_tracking: false, canon_cms: true, gamification: true, lead_tracker: false, structured_data: false },
    terminology: {
      canon: '학습 카드', signal: '수강생 피드백', quest: '학습 과제',
      agora: 'Q&A 게시판', cascade: '학습 인증', principal: '학원장 대시보드',
    },
    media: {
      heroTitle: '검증된 학습 자료만, 수강생에게 제공합니다.',
      heroSubtitle: '시험 합격을 위한 코스 자료와 멘토링 Q&A를 확인하세요.',
      searchPlaceholder: '과목, 작성자, 개념을 검색해 보세요...',
      canonTitle: '학습 커리큘럼 노트',
      canonSubtitle: '전문 강사진이 제작한 학습 카드와 포인트를 매주 업데이트합니다.',
    },
    pipelineConfig: {
      sources: [
        { type: 'custom', keywords: ['Python', 'React'] }
      ],
      frequency: 'daily'
    },
    aeoKeywords: [], aeoCompetitors: [],
  },
  jejuto: {
    id: 'jejuto',
    displayName: '제주to글로벌 커뮤니티',
    vertical: 'community',
    domain: null,
    logoUrl: null,
    roleLabels: {
      SYSOP: '기술 관리자', PRINCIPAL: '미디어 대표', EXPERT: '지역 전문가',
      STRATEGIST: '편집국장', REGION_LEAD: '마을 에디터', ACTIVIST: '시민 기자', CITIZEN: '주민·방문객',
    },
    theme: { primaryColor: '#f97316', accentColor: '#22c55e', selectionColor: 'rgba(249,115,22,0.3)' },
    features: { cascade: true, aeo_tracking: true, canon_cms: true, gamification: false, lead_tracker: false, structured_data: true },
    terminology: {
      canon: '지역 정보', signal: '지역 소식', quest: '취재 미션',
      agora: '주민 게시판', cascade: '소셜 공유', principal: '대표 대시보드',
    },
    media: {
      heroTitle: '우리 동네 이야기를, 주민이 직접 기록합니다.',
      heroSubtitle: '제주 지역 현안과 생생한 이야기를 주민 시선으로 전합니다.',
      searchPlaceholder: '마을, 관광지, 맛집을 검색해 보세요...',
      canonTitle: '지역 정보 아카이브',
      canonSubtitle: '주민이 기록하고 전문가가 검증한 제주도 정보 라이브러리입니다.',
    },
    pipelineConfig: {
      sources: [
        { type: 'news', keywords: ['제주 올레길', '제주 이주'] }
      ],
      frequency: 'daily'
    },
    aeoKeywords: [], aeoCompetitors: [],
  },
};

// ── 현재 테넌트 가져오기 ──────────────────────────────────────
// 우선순위: cookie(pxos_tenant) → localStorage → env → 'phalanx'
export function getTenantId(): string {
  if (typeof window !== 'undefined') {
    // 쿠키에서 읽기 (proxy.ts가 설정)
    const cookie = document.cookie.split('; ').find(c => c.startsWith('pxos_tenant='));
    if (cookie) return cookie.split('=')[1];
    // fallback: localStorage
    return localStorage.getItem('tenant_id')
      || process.env.NEXT_PUBLIC_TENANT_ID
      || 'phalanx';
  }
  return process.env.NEXT_PUBLIC_TENANT_ID || 'phalanx';
}

export function getTenantConfig(tenantId?: string): TenantConfig {
  const id = tenantId || getTenantId();
  return TENANT_PRESETS[id] || TENANT_PRESETS.phalanx;
}

/** 테넌트 전환 (쿠키 + localStorage + 페이지 새로고침) */
export function setTenantId(id: string) {
  if (typeof window !== 'undefined') {
    document.cookie = `pxos_tenant=${id}; path=/; max-age=${60 * 60 * 24 * 365}`;
    localStorage.setItem('tenant_id', id);
    window.location.reload();
  }
}

/** 버티컬별 용어를 가져오는 단축 헬퍼 */
export function t(key: keyof TenantConfig['terminology'], tenantId?: string): string {
  return getTenantConfig(tenantId).terminology[key];
}

/** 역할 라벨을 테넌트 기준으로 반환 */
export function getRoleLabel(role: Role, tenantId?: string): string {
  return getTenantConfig(tenantId).roleLabels[role];
}

/** 기능 활성화 여부 */
export function isFeatureEnabled(feature: keyof TenantConfig['features'], tenantId?: string): boolean {
  return getTenantConfig(tenantId).features[feature];
}

export const ALL_TENANT_IDS = Object.keys(TENANT_PRESETS);
export { TENANT_PRESETS };
