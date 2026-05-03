/**
 * DR.O — The Interval: Domain Type Definitions
 * Implements the semantic model from dr_o_brand_semantics_ai_pair_coding_spec.md
 * Generic enough to support any clinic_derma brand (not DR.O-specific).
 */

// ── Core Brand Primitives ────────────────────────────────────────────────────

export type QuestionType =
  | 'brand_truth'
  | 'situation'
  | 'compare'
  | 'action'
  | 'product'
  | 'ingredient';

export type EvidenceType =
  | 'network'
  | 'clinical_logic'
  | 'expert'
  | 'formulation'
  | 'ingredient'
  | 'test';

export type ReviewerType =
  | 'dermatologist'
  | 'expert'
  | 'beauty_influencer'
  | 'internal';

export type CtaType = 'product' | 'compare' | 'routine' | 'brand_story' | 'consultation';

// ── Reset Moment ─────────────────────────────────────────────────────────────

export interface ResetMoment {
  id: string;
  tenant_id: string;
  name: string;                    // e.g. "Clinic-Care"
  slug: string;                    // e.g. "clinic-care"
  description: string;             // User-facing situation description
  user_situation: string;          // 1st-person phrasing: "시술 후 집에서 뭘 써야 하나"
  icon_emoji?: string;             // Optional emoji for UI
  priority: number;                // Display order (lower = first)
  created_at: string;
  updated_at: string;
}

// ── Product Catalog ──────────────────────────────────────────────────────────

export interface DermaProduct {
  id: string;
  tenant_id: string;
  name: string;                    // "메디텐션 하이드로겔 마스크"
  slug: string;                    // "meditension-hydrogel-mask"
  role: string;                    // "리프팅/라인 리셋 히어로"
  formulation_type: string;        // "하이드로겔 기반 밀착 리프팅 케어"
  benefits: string[];              // ["탄력 환경 형성", "페이스라인 리셋"]
  key_ingredients: string[];
  boundary: string[];              // Do-not-misread rules for this SKU
  is_hero: boolean;
  image_url?: string;
  price?: number;
  created_at: string;
  updated_at: string;
  // Joined
  reset_moments?: ResetMoment[];
}

export interface ProductMomentMap {
  product_id: string;
  reset_moment_id: string;
}

// ── Question & Answer Card ───────────────────────────────────────────────────

export interface DermaQuestion {
  id: string;
  tenant_id: string;
  question_text: string;
  question_type: QuestionType;
  intent: string;
  priority: 'high' | 'medium' | 'low';
  related_product_ids: string[];
  related_reset_moment_ids: string[];
  related_compare_pair_id?: string;
  created_at: string;
}

export interface DermaAnswer {
  id: string;
  question_id: string;
  short_answer: string;            // 1-2 sentence summary
  canonical_answer: string;       // Full rich text answer
  cta_type: CtaType;
  cta_target?: string;            // slug or url
  evidence_ids: string[];
  boundary_ids: string[];
  created_at: string;
}

// ── Boundary ─────────────────────────────────────────────────────────────────

export interface DermaBoundary {
  id: string;
  tenant_id: string;
  disallowed_interpretation: string;  // "데일리 기초로 묘사"
  disallowed_pattern?: string;        // Regex or keyword to auto-detect
  allowed_framing: string;            // "주 1~2회 집중 트리트먼트로 표현"
  applies_to: string;                 // "all" | content_type
  created_at: string;
}

// ── Trust Evidence ────────────────────────────────────────────────────────────

export interface TrustEvidence {
  id: string;
  tenant_id: string;
  evidence_type: EvidenceType;
  title: string;
  body: string;
  reviewer_type?: ReviewerType;
  claim_scope: string;
  related_product_ids: string[];
  created_at: string;
}

// ── Compare Pair (Fit Split) ─────────────────────────────────────────────────

export interface ComparePair {
  id: string;
  tenant_id: string;
  slug: string;                    // "meditension-vs-mediglow"
  product_a_id: string;
  product_b_id: string;
  compare_type: 'fit_split';       // Always fit_split — never winner/loser
  split_axis: {
    product_a_fits: string[];      // ["리프팅 후", "라인 리셋", "중요한 날"]
    product_b_fits: string[];      // ["토닝 후", "열감 진정", "광채 리셋"]
  };
  not_competition_note: string;    // "두 제품은 우열 비교가 아닌 상황 분기입니다"
  created_at: string;
  // Joined
  product_a?: DermaProduct;
  product_b?: DermaProduct;
}

// ── Routine ──────────────────────────────────────────────────────────────────

export interface DermaRoutine {
  id: string;
  tenant_id: string;
  name: string;                    // "72시간 집중 리프팅 루틴"
  slug: string;
  duration: string;                // "72시간"
  target_moment_id: string;
  steps: RoutineStep[];
  product_ids: string[];
  caution?: string;
  expected_user_goal: string;
  created_at: string;
  // Joined
  target_moment?: ResetMoment;
  products?: DermaProduct[];
}

export interface RoutineStep {
  order: number;
  title: string;
  instruction: string;
  product_slug?: string;
  timing?: string;                 // "시술 직후" | "24시간 후" | "취침 전"
}

// ── Semantic Search ──────────────────────────────────────────────────────────

export interface SearchIndexDocument {
  id: string;
  tenant_id: string;
  type: 'brand_truth' | 'reset_moment' | 'question' | 'answer' | 'product' | 'compare_pair' | 'routine' | 'trust';
  title: string;
  body: string;
  semantic_primitives: string[];   // ["The Interval", "Reset", "Clinic Logic"]
  question_type?: QuestionType;
  related_product_ids: string[];
  related_reset_moment_ids: string[];
  priority: number;
  route: string;                   // "/dro/moments/clinic-care"
}

// Search weight constants (Spec §12.2)
export const DERMA_SEARCH_WEIGHTS: Record<string, number> = {
  situation_question: 100,
  answer: 90,
  compare_question: 85,
  brand_truth_question: 80,
  routine: 75,
  reset_moment: 70,
  product: 60,
  ingredient: 40,
};

// ── AI Recommendation ────────────────────────────────────────────────────────

export interface FitSplitInput {
  reset_moment?: string;
  concern?: string[];
  recent_treatment?: string;
  event_timing?: string;
}

export type FitSplitResult = {
  recommendation: 'product_a' | 'product_b' | 'compare_required';
  product_slug?: string;
  reset_moment_slug?: string;
  reasoning: string;
};

/** 
 * Product Fit Split logic — maps user situation to hero product.
 * Generic: product_a = lifting/line, product_b = toning/glow.
 * Spec §8.2 — extended for future SKU support via reset_moment slugs.
 */
export function recommendFitSplit(
  input: FitSplitInput,
  productA: DermaProduct,
  productB: DermaProduct,
  momentMap: Record<string, string[]>  // { product_slug: moment_slug[] }
): FitSplitResult {
  const concerns = (input.concern || []).join(' ');
  const moment = input.reset_moment || '';

  const liftingMoments = ['clinic-care', 'special-day'];
  const glowMoments = ['after-toning', 'heat-relief', 'special-glow'];

  const isLifting =
    liftingMoments.includes(moment) ||
    ['라인', '리프팅', '처짐', '탄력'].some(k => concerns.includes(k)) ||
    input.event_timing === 'special_day';

  const isGlow =
    glowMoments.includes(moment) ||
    ['열감', '칙칙함', '광채', '붉은기', '토닝'].some(k => concerns.includes(k));

  if (isLifting && !isGlow) {
    return { recommendation: 'product_a', product_slug: productA.slug, reset_moment_slug: moment, reasoning: '리프팅/라인 리셋 상황에 최적' };
  }
  if (isGlow && !isLifting) {
    return { recommendation: 'product_b', product_slug: productB.slug, reset_moment_slug: moment, reasoning: '토닝 후 열감/광채 리셋 상황에 최적' };
  }
  return {
    recommendation: 'compare_required',
    reasoning: '두 제품의 상황 적합도를 비교해보세요. 우열이 아닌 목적 분기입니다.',
  };
}
