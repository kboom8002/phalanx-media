/**
 * DR.O Boundary Guard System
 * Implements the Boundary enforcement from brand semantics spec §4.6, §18.2.
 * Generic: any clinic_derma tenant can register its own boundary rules.
 */

export interface BoundaryRule {
  id: string;
  pattern: RegExp | string;
  allowed_framing: string;
  severity: 'block' | 'warn';
}

// DR.O specific boundary rules (Spec §4.6)
export const DRO_BOUNDARY_RULES: BoundaryRule[] = [
  {
    id: 'no_daily',
    pattern: /매일\s*(바르|쓰|사용|사용하)/,
    allowed_framing: '주 1~2회 집중 트리트먼트로 표현하세요.',
    severity: 'block',
  },
  {
    id: 'no_daily_basic',
    pattern: /데일리\s*(기초|루틴|스킨케어)/,
    allowed_framing: '시술 연계형 스페셜 트리트먼트로 표현하세요.',
    severity: 'block',
  },
  {
    id: 'no_treatment_replacement',
    pattern: /시술\s*(대체|대신|필요\s*없|안\s*받아도)/,
    allowed_framing: '시술과 시술 사이(The Interval)의 홈케어로 표현하세요.',
    severity: 'block',
  },
  {
    id: 'no_medical_claim',
    pattern: /치료|의료적\s*(회복|처치)|질환\s*치료/,
    allowed_framing: '"helps support", "designed for the moment of" 등 안전 표현을 사용하세요.',
    severity: 'block',
  },
  {
    id: 'no_general_packMask',
    pattern: /일반\s*(마스크팩|팩|시트마스크)/,
    allowed_framing: '클리닉 로직 기반 홈 트리트먼트로 표현하세요.',
    severity: 'warn',
  },
  {
    id: 'no_superiority',
    pattern: /(메디텐션|메디글로우)\s*(보다|이\s*더|가\s*더)\s*(좋|낫|우수)/,
    allowed_framing: '두 제품은 상황 적합도 분기입니다. 우열로 비교하지 마세요.',
    severity: 'block',
  },
  {
    id: 'no_ingredient_only',
    pattern: /성분\s*(만|이\s*핵심|이\s*중요)/,
    allowed_framing: '성분보다 사용 타이밍과 상황 적합성이 핵심임을 강조하세요.',
    severity: 'warn',
  },
];

export interface BoundaryScanResult {
  passed: boolean;
  violations: Array<{
    rule_id: string;
    matched_text: string;
    allowed_framing: string;
    severity: 'block' | 'warn';
  }>;
  has_blocks: boolean;
  has_warnings: boolean;
}

/**
 * Scans text against boundary rules.
 * Returns violations with allowed_framing suggestions.
 * Can be called in CMS Desk before status transition to 'approved'.
 */
export function scanBoundaries(text: string, rules: BoundaryRule[] = DRO_BOUNDARY_RULES): BoundaryScanResult {
  const violations: BoundaryScanResult['violations'] = [];

  for (const rule of rules) {
    const regex = typeof rule.pattern === 'string'
      ? new RegExp(rule.pattern)
      : rule.pattern;

    const match = text.match(regex);
    if (match) {
      violations.push({
        rule_id: rule.id,
        matched_text: match[0],
        allowed_framing: rule.allowed_framing,
        severity: rule.severity,
      });
    }
  }

  return {
    passed: violations.filter(v => v.severity === 'block').length === 0,
    violations,
    has_blocks: violations.some(v => v.severity === 'block'),
    has_warnings: violations.some(v => v.severity === 'warn'),
  };
}

/**
 * Formats boundary scan result into a CMS reviewer comment string.
 */
export function formatBoundaryComment(result: BoundaryScanResult): string {
  if (result.passed && !result.has_warnings) return '';

  const lines = ['⚠️ **Boundary Guard 경고** — 발행 전 아래 내용을 수정해주세요.\n'];

  for (const v of result.violations) {
    const icon = v.severity === 'block' ? '🚫' : '⚠️';
    lines.push(`${icon} **"${v.matched_text}"** 표현 감지`);
    lines.push(`   → ${v.allowed_framing}\n`);
  }

  if (result.has_blocks) {
    lines.push('\n🔴 차단 표현이 포함되어 있습니다. 수정 후 재제출해주세요.');
  }

  return lines.join('\n');
}
