// Ontology Badge Components — phalanx-os IP 해자를 media 레이어에 노출
// SCL 등급 배지, PoK 레벨 배지, CIF Export 버튼

'use client';
import { useState } from 'react';
import { Shield, Award, Package, Download, CheckCircle, Globe } from 'lucide-react';

const OS_URL = process.env.NEXT_PUBLIC_OS_URL || 'https://phalanx-os.vercel.app';

// ── SCL 등급 배지 ─────────────────────────────────────────────────────
export type SCLGrade = 'draft' | 'tested' | 'validated' | 'certified' | 'canon';

const SCL_CONFIG: Record<SCLGrade, { stars: string; label: string; color: string; bg: string; border: string }> = {
  draft:     { stars: '★☆☆☆☆', label: 'Draft',       color: '#64748b', bg: '#f8fafc', border: '#cbd5e1' },
  tested:    { stars: '★★☆☆☆', label: 'Tested',      color: '#3b82f6', bg: '#eff6ff', border: '#93c5fd' },
  validated: { stars: '★★★☆☆', label: 'Validated',   color: '#22c55e', bg: '#f0fdf4', border: '#86efac' },
  certified: { stars: '★★★★☆', label: 'Certified',   color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
  canon:     { stars: '★★★★★', label: 'Canon-Grade', color: '#a855f7', bg: '#faf5ff', border: '#d8b4fe' },
};

function scoreToGrade(score: number): SCLGrade {
  if (score >= 91) return 'canon';
  if (score >= 76) return 'certified';
  if (score >= 51) return 'validated';
  if (score >= 21) return 'tested';
  return 'draft';
}

interface SCLBadgeProps {
  score?: number;
  grade?: SCLGrade;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function SCLBadge({ score, grade, size = 'sm', showLabel = true }: SCLBadgeProps) {
  const g = grade ?? scoreToGrade(score ?? 0);
  const cfg = SCL_CONFIG[g];

  if (size === 'sm') {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-bold rounded-full"
        style={{
          fontSize: '11px',
          padding: '3px 10px',
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
        }}
      >
        <Shield style={{ width: 10, height: 10 }} />
        {cfg.stars}
        {showLabel && <span style={{ marginLeft: 2 }}>{cfg.label}</span>}
        {score !== undefined && <span style={{ opacity: 0.6, marginLeft: 2 }}>({score})</span>}
      </span>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 font-bold rounded-xl"
      style={{
        fontSize: '13px',
        padding: '6px 14px',
        color: cfg.color,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <Shield style={{ width: 14, height: 14 }} />
      <span>{cfg.stars}</span>
      {showLabel && <span>SCL {cfg.label}</span>}
      {score !== undefined && <span style={{ opacity: 0.6 }}>{score}/100</span>}
    </div>
  );
}

// ── PoK 레벨 배지 ─────────────────────────────────────────────────────
const POK_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  learner:         { emoji: '🌱', color: '#94a3b8', bg: '#f8fafc', border: '#cbd5e1' },
  practitioner:    { emoji: '⚡', color: '#3b82f6', bg: '#eff6ff', border: '#93c5fd' },
  expert:          { emoji: '🔥', color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
  authority:       { emoji: '👑', color: '#a855f7', bg: '#faf5ff', border: '#d8b4fe' },
  canon_architect: { emoji: '🏛️', color: '#ec4899', bg: '#fdf2f8', border: '#f9a8d4' },
};

interface PoKBadgeProps {
  level: string;
  score?: number;
  badges?: Array<{ emoji: string; name: string }>;
}

export function PoKBadge({ level, score, badges }: PoKBadgeProps) {
  const cfg = POK_CONFIG[level] ?? POK_CONFIG.learner;
  const levelLabel = level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        className="inline-flex items-center gap-1.5 font-bold rounded-full"
        style={{
          fontSize: '11px',
          padding: '3px 10px',
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
        }}
      >
        <Award style={{ width: 10, height: 10 }} />
        {cfg.emoji} {levelLabel}
        {score !== undefined && <span style={{ opacity: 0.6, marginLeft: 2 }}>{score} PoK</span>}
      </span>
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {badges.slice(0, 3).map(b => (
            <span key={b.name} style={{ fontSize: '10px', padding: '1px 6px', background: '#f1f5f9', borderRadius: 999, color: '#64748b' }}>
              {b.emoji} {b.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CIF Export 버튼 ───────────────────────────────────────────────────
interface CIFExportButtonProps {
  objectId: string;
  contentName?: string;
}

export function CIFExportButton({ objectId, contentName }: CIFExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${OS_URL}/api/ontology/cif`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export', object_id: objectId }),
      });
      if (!res.ok) throw new Error('Export failed');
      const { cif } = await res.json();
      // JSON 다운로드
      const blob = new Blob([JSON.stringify(cif, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${contentName ?? objectId}.cif.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch {
      alert('CIF 내보내기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-1.5 font-bold rounded-full transition-all"
      style={{
        fontSize: '11px',
        padding: '3px 10px',
        background: done ? '#f0fdf4' : '#f8fafc',
        border: `1px solid ${done ? '#86efac' : '#cbd5e1'}`,
        color: done ? '#22c55e' : '#64748b',
        cursor: loading ? 'wait' : 'pointer',
      }}
    >
      {done ? <CheckCircle style={{ width: 10, height: 10 }} /> : <Package style={{ width: 10, height: 10 }} />}
      {loading ? '내보내는 중...' : done ? 'CIF 저장됨' : 'CIF 내보내기'}
    </button>
  );
}

// ── CrossInsight 카드 ─────────────────────────────────────────────────
interface CrossInsightCardProps {
  insight: {
    statement: string;
    insight_type: 'equivalence' | 'transfer' | 'amplify' | 'anti_pattern';
    confidence: number;
    source_tenant?: string;
    target_tenant?: string;
  };
}

const INSIGHT_TYPE_CONFIG = {
  equivalence:  { label: '등가 발견', color: '#6366f1', emoji: '⚡' },
  transfer:     { label: '지식 전이', color: '#22c55e', emoji: '🔄' },
  amplify:      { label: '증폭 효과', color: '#f59e0b', emoji: '🔥' },
  anti_pattern: { label: '반패턴', color: '#ef4444', emoji: '⚠️' },
};

export function CrossInsightCard({ insight }: CrossInsightCardProps) {
  const cfg = INSIGHT_TYPE_CONFIG[insight.insight_type];

  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(34,211,238,0.03))', border: '1px solid rgba(99,102,241,0.12)' }}
    >
      <div style={{ fontSize: 20, lineHeight: 1 }}>{cfg.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: `${cfg.color}10`, padding: '2px 8px', borderRadius: 999 }}>
            {cfg.label}
          </span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>신뢰도 {Math.round(insight.confidence * 100)}%</span>
          {insight.source_tenant && insight.target_tenant && (
            <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe style={{ width: 9, height: 9 }} />
              {insight.source_tenant} × {insight.target_tenant}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>{insight.statement}</p>
      </div>
    </div>
  );
}

// ── 마켓플레이스 아이템 카드 ─────────────────────────────────────────
interface MarketItemCardProps {
  item: {
    id: string;
    name: string;
    object_type: string;
    scl_score?: number;
    fork_count?: number;
    total_pok_earned?: number;
    properties?: Record<string, string>;
    tenant_id?: string;
  };
  tenantId: string;
}

export function MarketItemCard({ item, tenantId }: MarketItemCardProps) {
  const grade = scoreToGrade(item.scl_score ?? 0);
  const cfg = SCL_CONFIG[grade];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
      style={{ background: '#fff', border: '1px solid #e2e8f0' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            {item.object_type}
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }} className="line-clamp-2">
            {item.name}
          </h3>
        </div>
        {item.scl_score !== undefined && (
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap', fontWeight: 700 }}>
            {cfg.stars}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4" style={{ fontSize: 11, color: '#94a3b8' }}>
        {item.fork_count !== undefined && <span>🍴 Fork {item.fork_count}회</span>}
        {item.total_pok_earned !== undefined && <span>🏆 PoK {item.total_pok_earned?.toFixed(1)}</span>}
        {item.tenant_id && <span>🏢 {item.tenant_id}</span>}
      </div>
      {item.properties?.T && (
        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }} className="line-clamp-2">
          {item.properties.T}
        </p>
      )}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <CIFExportButton objectId={item.id} contentName={item.name.slice(0, 30)} />
      </div>
    </div>
  );
}
