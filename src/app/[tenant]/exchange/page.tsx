// KGIP Exchange 랜딩 — 외부 조직 접근점
import type { Metadata } from 'next';
import { getTenantConfig } from '@/lib/tenant-config';
import { Globe, GitFork, Shield, ArrowRight, Link2, Building2 } from 'lucide-react';
import { SCLBadge } from '@/components/OntologyBadges';

export const revalidate = 300;
const OS_URL = process.env.NEXT_PUBLIC_OS_URL || 'https://phalanx-os.vercel.app';

export async function generateMetadata({ params }: { params: Promise<{ tenant: string }> }): Promise<Metadata> {
  const p = await params;
  const tc = getTenantConfig(p.tenant);
  return { title: `Knowledge Exchange | ${tc.displayName}`, description: `KGIP 프로토콜로 조직 간 지식을 교환하세요.` };
}

async function fetchKGIPCatalog() {
  try {
    const res = await fetch(`${OS_URL}/api/kgip?limit=12&min_scl=50`, { next: { revalidate: 300 } });
    if (!res.ok) return { catalog: [], total: 0 };
    return res.json();
  } catch { return { catalog: [], total: 0 }; }
}

const MOCK_CATALOG = [
  { object_id: 'k1', domain: '경영학', scl_grade: 'certified' as const, scl_score: 82, content: { T: '가격 앵커링 전략의 인지심리학적 기반' }, author: { display_name: 'Phalanx JS-Oracle' } },
  { object_id: 'k2', domain: '심리학', scl_grade: 'validated' as const, scl_score: 71, content: { T: '자기효능감 회복 루프의 임계점 분석' }, author: { display_name: 'Phalanx LoopOS' } },
  { object_id: 'k3', domain: '피부과학', scl_grade: 'certified' as const, scl_score: 79, content: { T: '시술 후 72시간 피부 장벽 재건 프로토콜' }, author: { display_name: 'Phalanx DR.O' } },
];

export default async function ExchangePage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || 'loopOS';
  const tc = getTenantConfig(tenantId);

  const { catalog } = await fetchKGIPCatalog();
  const display = catalog?.length > 0 ? catalog : MOCK_CATALOG;

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh' }}>
      <header style={{ background: 'linear-gradient(135deg, #020617, #0f172a)', padding: '80px 16px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 24 }}>
            <Globe style={{ width: 12, height: 12 }} /> KGIP — Knowledge Graph Interchange Protocol
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 900, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            조직의 지식 그래프를<br />서로 연결하세요
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
            KGIP 프로토콜로 조직 간 CIF 패키지를 교환하면,
            교차 발견(CrossInsight)이 자동으로 생성됩니다.
            두 조직이 단독으로는 발견할 수 없었던 가치가 O(n²)으로 증폭됩니다.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={`/${tenantId}/marketplace`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: 999, fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
              지식 탐색하기 <ArrowRight style={{ width: 14, height: 14 }} />
            </a>
            <a href={`/${tenantId}/agora/ask`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              조직 등록 문의
            </a>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 16px' }}>
        {/* KGIP 작동 원리 */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 32 }}>KGIP 작동 원리</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { step: '01', icon: Building2, title: '조직 등록', desc: 'Endpoint와 도메인을 등록하면 KGIP 네트워크에 참여' },
              { step: '02', icon: Link2, title: 'CIF 교환', desc: 'SHA-256 서명된 CIF 패키지를 안전하게 교환' },
              { step: '03', icon: Globe, title: 'CrossInsight 발견', desc: '교차 조직 지식에서 AI가 숨겨진 인사이트 자동 발견' },
              { step: '04', icon: Shield, title: 'PoK 로열티', desc: 'Fork·인용 시 원작자에게 PoK 자동 적립' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: '#10b981', letterSpacing: '0.1em', marginBottom: 8 }}>STEP {step}</div>
                <Icon style={{ width: 24, height: 24, margin: '0 auto 12px', color: '#6366f1' }} />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 공개 카탈로그 */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24 }}>
            🌐 KGIP 공개 카탈로그 ({display.length}건)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {display.map((cif: typeof MOCK_CATALOG[0]) => (
              <div key={cif.object_id} style={{ background: '#fff', borderRadius: 14, padding: 18, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cif.domain}</span>
                  <SCLBadge grade={cif.scl_grade} score={cif.scl_score} />
                </div>
                <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, lineHeight: 1.4, marginBottom: 10 }}>{cif.content?.T}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>by {cif.author?.display_name}</span>
                  <a href={`/${tenantId}/marketplace`} style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <GitFork style={{ width: 10, height: 10 }} /> Fork
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 조직 등록 CTA */}
        <section style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))', borderRadius: 24, padding: '48px 32px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.2)' }}>
          <Globe style={{ width: 36, height: 36, margin: '0 auto 16px', color: '#10b981' }} />
          <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>조직의 지식을 KGIP 네트워크에 연결하세요</h3>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            참여 조직이 늘어날수록 CrossInsight 발견 가능성이 O(n²)으로 증폭됩니다.
          </p>
          <a href="mailto:contact@phalanx.io" style={{ background: '#10b981', color: '#fff', padding: '12px 28px', borderRadius: 999, fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
            조직 등록 문의하기 →
          </a>
        </section>
      </main>
    </div>
  );
}
