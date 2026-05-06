// 마켓플레이스 퍼블릭 페이지 — phalanx-os 온톨로지 공개 지식 탐색
import type { Metadata } from 'next';
import { getTenantConfig } from '@/lib/tenant-config';
import { ShoppingBag, GitFork, Shield, TrendingUp, Globe } from 'lucide-react';
import { MarketItemCard, SCLBadge } from '@/components/OntologyBadges';

export const revalidate = 60;

const OS_URL = process.env.NEXT_PUBLIC_OS_URL || 'https://phalanx-os.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const p = await params;
  const tc = getTenantConfig(p.tenant);
  return {
    title: `지식 마켓플레이스 | ${tc.displayName}`,
    description: `${tc.displayName}의 검증된 지식 자산을 탐색하고 Fork하세요. SCL 인증 CasePack 라이브러리.`,
  };
}

async function fetchMarketItems(tenantId: string) {
  try {
    const res = await fetch(
      `${OS_URL}/api/ontology/marketplace?tenant=${tenantId}&sort=fork_count&limit=20`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return { items: [], total: 0, stats: null };
    return res.json();
  } catch { return { items: [], total: 0, stats: null }; }
}

async function fetchGlobalCatalog() {
  try {
    const res = await fetch(
      `${OS_URL}/api/kgip?limit=12&min_scl=50`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { catalog: [] };
    return res.json();
  } catch { return { catalog: [] }; }
}

const SCL_FILTER_OPTIONS = [
  { label: '전체', value: '' },
  { label: '★★★★★ Canon', value: 'canon' },
  { label: '★★★★ Certified', value: 'certified' },
  { label: '★★★ Validated', value: 'validated' },
];

export default async function MarketplacePage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || 'loopOS';
  const tc = getTenantConfig(tenantId);

  const [{ items, total, stats }, { catalog }] = await Promise.all([
    fetchMarketItems(tenantId),
    fetchGlobalCatalog(),
  ]);

  const MOCK_ITEMS = [
    { id: 'mk1', name: '가격 앵커링 협상 전략 CasePack', object_type: 'CasePack', scl_score: 82, fork_count: 12, total_pok_earned: 84.5, properties: { T: '부동산 협상에서 최초 가격 앵커를 설정하는 전략 실행' }, tenant_id: tenantId },
    { id: 'mk2', name: '리스크 분산 포트폴리오 구성', object_type: 'CasePack', scl_score: 75, fork_count: 8, total_pok_earned: 52.0, properties: { T: '수익률과 안정성을 동시에 달성하는 자산 배분 논리' }, tenant_id: tenantId },
    { id: 'mk3', name: '딜 성사 후기 분석 패턴', object_type: 'CasePack', scl_score: 91, fork_count: 23, total_pok_earned: 178.5, properties: { T: '성사된 딜의 공통 패턴을 역설계하여 재현 가능한 전략 도출' }, tenant_id: tenantId },
    { id: 'mk4', name: '매수자 심리 프로파일링', object_type: 'CasePack', scl_score: 68, fork_count: 5, total_pok_earned: 27.0, properties: { T: '초기 면담에서 매수자의 의사결정 패턴을 파악하는 방법' }, tenant_id: tenantId },
  ];

  const displayItems = items?.length > 0 ? items : MOCK_ITEMS;
  const displayTotal = total || MOCK_ITEMS.length;
  const displayStats = stats || { total_listed: displayItems.length, total_forks: 48, avg_scl_score: 79.0 };

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      {/* 헤더 */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '80px 16px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
            <ShoppingBag style={{ width: 12, height: 12 }} /> Knowledge Marketplace — {tc.displayName}
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#0f172a', marginBottom: 16, lineHeight: 1.2 }}>
            검증된 지식 자산을 탐색하고<br />내 컨텍스트에 Fork하세요
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
            SCL 인증을 통과한 CasePack을 탐색하고, Fork하면 원작자에게 PoK 로열티가 자동 적립됩니다.
          </p>

          {/* 통계 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { label: '공개 지식', value: displayTotal, suffix: '건', icon: '📦' },
              { label: '총 Fork', value: displayStats?.total_forks ?? 0, suffix: '회', icon: '🍴' },
              { label: '평균 SCL', value: Math.round(displayStats?.avg_scl_score ?? 0), suffix: '점', icon: '🛡️' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#6366f1' }}>{s.icon} {s.value}<span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginLeft: 2 }}>{s.suffix}</span></div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 16px' }}>
        {/* 테넌트 지식 */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              🏢 {tc.displayName} 공개 지식 ({displayTotal}건)
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {SCL_FILTER_OPTIONS.map(o => (
                <span key={o.value} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 999, background: '#f1f5f9', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>{o.label}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {displayItems.map((item: Parameters<typeof MarketItemCard>[0]['item']) => (
              <MarketItemCard key={item.id} item={item} tenantId={tenantId} />
            ))}
          </div>
        </section>

        {/* KGIP 공개 카탈로그 */}
        {catalog?.length > 0 && (
          <section style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Globe style={{ width: 20, height: 20, color: '#10b981' }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                🌐 KGIP 글로벌 카탈로그 — 크로스-Org 공개 지식
              </h2>
            </div>
            <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.03), rgba(99,102,241,0.03))', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {catalog.slice(0, 6).map((cif: { object_id: string; content: { T: string }; domain: string; scl_grade: string; scl_score: number; author: { display_name: string } }) => (
                  <div key={cif.object_id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>{cif.domain}</span>
                      <SCLBadge grade={cif.scl_grade as 'draft' | 'tested' | 'validated' | 'certified' | 'canon'} />
                    </div>
                    <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, lineHeight: 1.4 }} className="line-clamp-2">
                      {cif.content?.T ?? '(내용 없음)'}
                    </p>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 8 }}>by {cif.author?.display_name}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <a href={`/${tenantId}/exchange`} style={{ fontSize: 13, color: '#10b981', fontWeight: 700, textDecoration: 'none' }}>
                  KGIP 전체 카탈로그 보기 →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: 24, padding: '48px 32px', textAlign: 'center', color: '#fff' }}>
          <TrendingUp style={{ width: 32, height: 32, margin: '0 auto 16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>내 지식을 마켓플레이스에 공개하세요</h3>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24 }}>
            SCL 인증을 받고 공개하면 Fork될 때마다 PoK 로열티가 자동 적립됩니다.
          </p>
          <a href={`/${tenantId}/agora/ask`} style={{ background: '#fff', color: '#6366f1', padding: '12px 28px', borderRadius: 999, fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
            지식 생성 시작하기 →
          </a>
        </section>
      </main>
    </div>
  );
}
