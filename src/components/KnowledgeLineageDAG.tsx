'use client';
// ⑧ Knowledge Lineage DAG — D3.js 기반 지식 족보 시각화
// CasePack/IM/Deal이 어떻게 연결되고 진화했는지 DAG으로 표현
import { useEffect, useRef, useState } from 'react';
import { GitBranch, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// ── 타입 정의 ────────────────────────────────────────────────────────
interface LineageNode {
  id: string;
  label: string;
  type: 'origin' | 'fork' | 'upgrade' | 'cross' | 'im' | 'deal';
  scl_score?: number;
  tenant?: string;
  x?: number;
  y?: number;
}

interface LineageLink {
  source: string;
  target: string;
  type: 'produces' | 'derived_from' | 'crosses_with' | 'upgrades_to' | 'matched_with';
}

interface LineageData {
  nodes: LineageNode[];
  links: LineageLink[];
}

// ── Mock lineage 데이터 (온톨로지 API 연동 전 기본값) ──────────────
const MOCK_LINEAGE: LineageData = {
  nodes: [
    { id: 'n1', label: '가격 앵커링 패턴\n(원본 CasePack)', type: 'origin', scl_score: 72, tenant: 'loopOS' },
    { id: 'n2', label: 'JS-Oracle\nIM v1 (강남)', type: 'im', scl_score: 65, tenant: 'js_oracle' },
    { id: 'n3', label: 'JS-Oracle\nIM v2 (마포)', type: 'im', scl_score: 78, tenant: 'js_oracle' },
    { id: 'n4', label: 'CrossInsight\n부동산 × 의료미용', type: 'cross', scl_score: 82, tenant: 'js_oracle' },
    { id: 'n5', label: 'DR.O 패키지\n번들링 패턴', type: 'fork', scl_score: 74, tenant: 'dro' },
    { id: 'n6', label: '딜 성사 패턴\n(SCL Certified)', type: 'upgrade', scl_score: 85, tenant: 'js_oracle' },
    { id: 'n7', label: '법인 사옥 매칭\nRunReceipt', type: 'deal', scl_score: 88, tenant: 'js_oracle' },
    { id: 'n8', label: '반패턴 경고 v1\n(Cap Rate<3%)', type: 'upgrade', scl_score: 79, tenant: 'js_oracle' },
  ],
  links: [
    { source: 'n1', target: 'n2', type: 'produces' },
    { source: 'n2', target: 'n3', type: 'upgrades_to' },
    { source: 'n1', target: 'n4', type: 'crosses_with' },
    { source: 'n4', target: 'n5', type: 'derived_from' },
    { source: 'n3', target: 'n6', type: 'produces' },
    { source: 'n6', target: 'n7', type: 'matched_with' },
    { source: 'n3', target: 'n8', type: 'produces' },
  ],
};

// 노드 타입별 색상
const NODE_COLORS: Record<string, string> = {
  origin:  '#6366f1',
  fork:    '#a855f7',
  upgrade: '#22c55e',
  cross:   '#f59e0b',
  im:      '#0ea5e9',
  deal:    '#10b981',
};

const LINK_COLORS: Record<string, string> = {
  produces:     '#6366f1',
  derived_from: '#a855f7',
  crosses_with: '#f59e0b',
  upgrades_to:  '#22c55e',
  matched_with: '#10b981',
};

// ── SVG 레이아웃 계산 ─────────────────────────────────────────────
function computeLayout(data: LineageData, width: number, height: number): LineageData {
  // 간단한 계층 레이아웃 (depth-first BFS)
  const nodeMap = new Map(data.nodes.map(n => [n.id, { ...n }]));
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();

  data.links.forEach(l => {
    if (!children.has(l.source)) children.set(l.source, []);
    children.get(l.source)!.push(l.target);
    if (!parents.has(l.target)) parents.set(l.target, []);
    parents.get(l.target)!.push(l.source);
  });

  // 루트 노드 (부모 없는 노드)
  const roots = data.nodes.filter(n => !parents.has(n.id)).map(n => n.id);

  // BFS로 레이어 배정
  const layer = new Map<string, number>();
  const queue = roots.map(r => ({ id: r, depth: 0 }));
  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (layer.has(id)) continue;
    layer.set(id, depth);
    (children.get(id) ?? []).forEach(child => queue.push({ id: child, depth: depth + 1 }));
  }

  // 레이어별 노드 배치
  const layerNodes = new Map<number, string[]>();
  layer.forEach((d, id) => {
    if (!layerNodes.has(d)) layerNodes.set(d, []);
    layerNodes.get(d)!.push(id);
  });

  const maxDepth = Math.max(...Array.from(layer.values()));
  const xStep = Math.min((width - 120) / Math.max(maxDepth, 1), 180);
  const margin = 60;

  layerNodes.forEach((ids, depth) => {
    const yStep = (height - margin * 2) / Math.max(ids.length, 1);
    ids.forEach((id, i) => {
      const node = nodeMap.get(id)!;
      node.x = margin + depth * xStep;
      node.y = margin + yStep * i + yStep / 2;
    });
  });

  return {
    nodes: Array.from(nodeMap.values()),
    links: data.links,
  };
}

interface Props {
  objectId?: string;
  tenantId?: string;
  height?: number;
}

export default function KnowledgeLineageDAG({ objectId, tenantId = 'js_oracle', height = 420 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<LineageData>(MOCK_LINEAGE);
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<LineageNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height });

  // 컨테이너 크기 감지
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDimensions({ width: Math.max(width, 400), height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [height]);

  // 온톨로지 API에서 lineage 데이터 fetch (있으면 교체)
  useEffect(() => {
    if (!objectId) return;
    setLoading(true);
    const osUrl = process.env.NEXT_PUBLIC_OS_URL || 'https://phalanx-os.vercel.app';
    fetch(`${osUrl}/api/ontology/lineage?object_id=${objectId}&tenant_id=${tenantId}&depth=3`)
      .then(r => r.json())
      .then(d => { if (d.nodes?.length > 0) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [objectId, tenantId]);

  const laid = computeLayout(data, dimensions.width / zoom, dimensions.height / zoom);

  const nodeMap = new Map(laid.nodes.map(n => [n.id, n]));

  return (
    <div style={{ background: '#0f172a', borderRadius: 20, border: '1px solid rgba(99,102,241,0.2)', overflow: 'hidden' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GitBranch style={{ width: 16, height: 16, color: '#6366f1' }} />
          <span style={{ fontWeight: 800, color: '#e2e8f0', fontSize: 14 }}>Knowledge Lineage DAG</span>
          {loading && <span style={{ fontSize: 11, color: '#64748b' }}>불러오는 중...</span>}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZoomIn style={{ width: 13, height: 13 }} />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.4))}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZoomOut style={{ width: 13, height: 13 }} />
          </button>
          <button onClick={() => setZoom(1)}
            style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Maximize2 style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {/* SVG DAG */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block', cursor: 'default' }}
      >
        <defs>
          {/* 화살표 마커 */}
          {Object.entries(LINK_COLORS).map(([type, color]) => (
            <marker key={type} id={`arrow-${type}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={color} opacity={0.7} />
            </marker>
          ))}
          {/* 노드 glow 필터 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g transform={`scale(${zoom})`}>
          {/* 링크 렌더링 */}
          {laid.links.map((link, i) => {
            const s = nodeMap.get(link.source);
            const t = nodeMap.get(link.target);
            if (!s?.x || !s.y || !t?.x || !t.y) return null;
            const color = LINK_COLORS[link.type] ?? '#6366f1';
            // 곡선 경로
            const mx = (s.x + t.x) / 2;
            const d = `M ${s.x + 38} ${s.y} C ${mx} ${s.y}, ${mx} ${t.y}, ${t.x - 38} ${t.y}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5}
                  markerEnd={`url(#arrow-${link.type})`} />
              </g>
            );
          })}

          {/* 노드 렌더링 */}
          {laid.nodes.map(node => {
            if (!node.x || !node.y) return null;
            const color = NODE_COLORS[node.type] ?? '#6366f1';
            const isSelected = selected?.id === node.id;
            const lines = node.label.split('\n');
            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelected(isSelected ? null : node)}>
                {/* 외곽 링 (선택 시) */}
                {isSelected && (
                  <rect x={-42} y={-32} width={84} height={64} rx={14}
                    fill="none" stroke={color} strokeWidth={2} opacity={0.6} filter="url(#glow)" />
                )}
                {/* 노드 배경 */}
                <rect x={-40} y={-30} width={80} height={60} rx={12}
                  fill={`${color}18`} stroke={color} strokeWidth={isSelected ? 2 : 1} opacity={isSelected ? 1 : 0.8} />
                {/* SCL 점수 바 */}
                {node.scl_score && (
                  <rect x={-38} y={20} width={76 * (node.scl_score / 100)} height={4} rx={2} fill={color} opacity={0.6} />
                )}
                {/* 텍스트 */}
                {lines.map((line, li) => (
                  <text key={li} x={0} y={-8 + li * 13} textAnchor="middle" fill="#e2e8f0"
                    fontSize={9} fontWeight={600}>
                    {line}
                  </text>
                ))}
                {/* SCL 점수 텍스트 */}
                {node.scl_score && (
                  <text x={0} y={28} textAnchor="middle" fill={color} fontSize={8} fontWeight={800}>
                    SCL {node.scl_score}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 선택 노드 상세 패널 */}
      {selected && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: NODE_COLORS[selected.type] ?? '#6366f1', flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 13 }}>{selected.label.replace('\n', ' ')}</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>
              타입: <span style={{ color: NODE_COLORS[selected.type] }}>{selected.type}</span>
              {selected.scl_score && ` · SCL ${selected.scl_score}점`}
              {selected.tenant && ` · 테넌트: ${selected.tenant}`}
            </p>
          </div>
        </div>
      )}

      {/* 범례 */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 10, color: '#475569' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
