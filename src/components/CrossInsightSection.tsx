// CrossInsight 서버 컴포넌트 — 테넌트 홈 하단에 삽입
// phalanx-os /api/ontology/cross-insights에서 데이터 fetch
import Link from 'next/link';
import { CrossInsightCard } from './OntologyBadges';
import { Zap } from 'lucide-react';

const OS_URL = process.env.NEXT_PUBLIC_OS_URL || 'https://phalanx-os.vercel.app';

interface Insight {
  id: string;
  statement: string;
  insight_type: 'equivalence' | 'transfer' | 'amplify' | 'anti_pattern';
  confidence: number;
  source_tenant?: string;
  target_tenant?: string;
}

async function fetchCrossInsights(tenantId: string): Promise<Insight[]> {
  try {
    const res = await fetch(
      `${OS_URL}/api/ontology/cross-insights?tenant_id=${tenantId}&limit=4`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.insights ?? [];
  } catch { return []; }
}

// 테넌트별 대표 CrossInsight 목 데이터
const MOCK_CROSS_INSIGHTS: Record<string, Insight[]> = {
  js_oracle: [
    { id: 'ci1', statement: '가격 앵커링 효과는 부동산 매물 제시와 피부과 시술 패키지 번들링에 동일하게 작동한다. 첫 제시 가격이 협상의 준거점이 되는 원리는 도메인을 초월한다.', insight_type: 'equivalence', confidence: 0.87, source_tenant: 'js_oracle', target_tenant: 'dro' },
    { id: 'ci2', statement: '딜 성사 후 72시간 내 첫 사후 연락이 장기 관계 형성에 결정적이다. 이는 K-웨딩 스냅 계약에도 동일하게 적용 가능하다.', insight_type: 'transfer', confidence: 0.79, source_tenant: 'js_oracle', target_tenant: 'kwedding' },
  ],
  loopOS: [
    { id: 'ci3', statement: 'PCE 자기신뢰 회복 루프와 학습 좌절 회복 루틴의 핵심 구조가 동일하다. 실패 직후 72시간 내 첫 재시도가 임계 변수.', insight_type: 'equivalence', confidence: 0.82, source_tenant: 'loopOS', target_tenant: 'tfstudio' },
    { id: 'ci4', statement: 'Cross-Domain Architect의 인사이트 생성 속도는 도메인 수가 늘어날수록 선형이 아닌 기하급수적으로 증가한다. 제주 디지털 노마드의 다중 문화 경험과 구조가 동일하다.', insight_type: 'amplify', confidence: 0.74, source_tenant: 'loopOS', target_tenant: 'jejuto' },
  ],
};

function getDefaultInsights(tenantId: string): Insight[] {
  return MOCK_CROSS_INSIGHTS[tenantId] ?? MOCK_CROSS_INSIGHTS.loopOS;
}

interface CrossInsightSectionProps {
  tenantId: string;
}

export default async function CrossInsightSection({ tenantId }: CrossInsightSectionProps) {
  const insights = await fetchCrossInsights(tenantId);
  const display = insights.length > 0 ? insights : getDefaultInsights(tenantId);

  if (display.length === 0) return null;

  return (
    <section style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Zap style={{ width: 18, height: 18, color: '#6366f1' }} />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Cross-Domain 인사이트</h2>
          </div>
          <p style={{ fontSize: 13, color: '#64748b' }}>이 테넌트의 지식과 다른 도메인이 교차하여 발견된 새로운 통찰</p>
        </div>
        <Link href={`/${tenantId}/marketplace`} style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
          전체 보기 →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {display.map(insight => (
          <CrossInsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Link
          href={`/${tenantId}/exchange`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#10b981', textDecoration: 'none', padding: '8px 18px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 999 }}
        >
          KGIP 교환 더 알아보기 →
        </Link>
      </div>
    </section>
  );
}
