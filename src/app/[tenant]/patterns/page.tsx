// Pattern Library — 성공 패턴 퍼블릭 라이브러리
import type { Metadata } from 'next';
import { getTenantConfig } from '@/lib/tenant-config';
import { BarChart2, Target, Copy, ArrowRight, Lightbulb } from 'lucide-react';
import { SCLBadge } from '@/components/OntologyBadges';

export const revalidate = 120;
const OS_URL = process.env.NEXT_PUBLIC_OS_URL || 'https://phalanx-os.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const p = await params;
  const tc = getTenantConfig(p.tenant);
  return { title: `성공 패턴 라이브러리 | ${tc.displayName}`, description: `검증된 성공 패턴 템플릿 라이브러리.` };
}

const MOCK_PATTERNS: Record<string, Array<{ id: string; pattern_name: string; confidence: number; usage_count: number; success_metric: string; common_elements: string[]; differentiators: string[]; template: { description: string } }>> = {
  js_oracle: [
    { id: 'p1', pattern_name: '딜 성사 3-단계 앵커링 패턴', confidence: 0.85, usage_count: 24, success_metric: '거래 성사율 34% 향상', common_elements: ['초기 가격 앵커 설정', '48시간 내 후속 연락', '비교 사례 3건 제시'], differentiators: ['지역별 세금 구조', '매수자 리스크 프로파일'], template: { description: '협상 시작 전 앵커를 설정하고, 비교 데이터로 신뢰를 구축하며, 48시간 내 추진력을 유지한다.' } },
  ],
  loopOS: [
    { id: 'p2', pattern_name: 'Cross-Domain 인사이트 생성 패턴', confidence: 0.78, usage_count: 31, success_metric: 'CrossInsight 발견율 3.2배', common_elements: ['2개 이상 도메인 선택', '유사도 70% 이상 탐색', '교차 지점 명시화'], differentiators: ['도메인 추상화 레벨', '적용 컨텍스트 차이'], template: { description: '서로 다른 도메인의 Object를 유사도로 연결하고, 교차 지점에서 새로운 인사이트를 추출한다.' } },
  ],
};

export default async function PatternsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || 'loopOS';
  const tc = getTenantConfig(tenantId);

  let patterns: typeof MOCK_PATTERNS['loopOS'] = [];
  try {
    const res = await fetch(`${OS_URL}/api/ontology/patterns?tenant_id=${tenantId}`, { next: { revalidate: 120 } });
    if (res.ok) { const d = await res.json(); patterns = d.patterns ?? []; }
  } catch { /* fallback */ }

  const display = patterns.length > 0 ? patterns : (MOCK_PATTERNS[tenantId] ?? MOCK_PATTERNS.loopOS);

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '80px 16px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fffbeb', border: '1px solid #fcd34d', color: '#d97706', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
            <BarChart2 style={{ width: 12, height: 12 }} /> 성공 패턴 라이브러리 — {tc.displayName}
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>검증된 성공 공식을 재사용 가능한 템플릿으로</h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>성공한 CasePack 군집에서 AI가 공통 패턴을 추출합니다. 이 템플릿으로 새 CasePack을 즉시 작성하세요.</p>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 16px' }}>
        {display.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <Lightbulb style={{ width: 40, height: 40, margin: '0 auto 16px', opacity: 0.5 }} />
            <p>아직 추출된 패턴이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {display.map(pattern => (
              <div key={pattern.id} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>📊 {pattern.pattern_name}</h2>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>신뢰도 {Math.round(pattern.confidence * 100)}%</span>
                      <span style={{ fontSize: 12, color: '#64748b' }}>사용 {pattern.usage_count}회</span>
                      {pattern.success_metric && (
                        <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, background: '#f0fdf4', padding: '2px 10px', borderRadius: 999, border: '1px solid #86efac' }}>✅ {pattern.success_metric}</span>
                      )}
                    </div>
                  </div>
                  <SCLBadge score={Math.round(pattern.confidence * 100)} size="md" />
                </div>

                {pattern.template?.description && (
                  <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginBottom: 16, borderLeft: '3px solid #6366f1' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: 4 }}>패턴 템플릿</div>
                    <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{pattern.template.description}</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {pattern.common_elements?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Target style={{ width: 12, height: 12 }} /> 공통 성공 요소
                      </div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {pattern.common_elements.map((el, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#475569', display: 'flex', gap: 6 }}>
                            <span style={{ color: '#f59e0b', fontWeight: 700 }}>→</span>{el}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pattern.differentiators?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Lightbulb style={{ width: 12, height: 12 }} /> 컨텍스트 변수
                      </div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {pattern.differentiators.map((el, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#475569', display: 'flex', gap: 6 }}>
                            <span style={{ color: '#8b5cf6', fontWeight: 700 }}>◆</span>{el}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
                  <a href={`/${tenantId}/agora/ask`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#6366f1', textDecoration: 'none', padding: '6px 14px', background: '#eef2ff', borderRadius: 999 }}>
                    <Copy style={{ width: 11, height: 11 }} /> 이 패턴으로 CasePack 작성
                  </a>
                  <a href={`/${tenantId}/marketplace`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#64748b', textDecoration: 'none' }}>
                    관련 지식 탐색 <ArrowRight style={{ width: 11, height: 11 }} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
