/**
 * DR.O AEO Structured Data Generator (Phase 4)
 * Implements spec §14 — generates JSON-LD for AI search engine citation.
 * Follows Medical/Beauty Claim Safety rules (§14.4).
 * Generic enough for any clinic_derma brand.
 */

import type { DermaProduct, DermaRoutine, DermaQuestion, DermaAnswer } from './dro-types';

// ── Safe claim language (Spec §14.4) ─────────────────────────────────────────
const SAFE_CLAIM_LANGUAGE = {
  replace: [
    { unsafe: /치료합니다|치료하는/, safe: '피부 상태 개선을 돕습니다' },
    { unsafe: /시술을 대체/, safe: '시술과 시술 사이의 홈케어를 지원합니다' },
    { unsafe: /보장합니다|확실합니다/, safe: '지원하도록 설계되었습니다' },
    { unsafe: /의료적 회복/, safe: '홈 더마 리셋' },
  ],
};

export function applySafeClaimLanguage(text: string): string {
  let result = text;
  for (const rule of SAFE_CLAIM_LANGUAGE.replace) {
    result = result.replace(rule.unsafe, rule.safe);
  }
  return result;
}

// ── FAQPage JSON-LD (for Answer Cards / Moments / Compare pages) ─────────────
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: applySafeClaimLanguage(answer),
      },
    })),
  };
  return JSON.stringify(schema);
}

// ── Product JSON-LD (only when product details are verified) ─────────────────
export function generateProductSchema(product: DermaProduct, brandName: string): string {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: applySafeClaimLanguage(
      `${product.role}. ${product.formulation_type}. ${product.benefits.join(', ')}.`
    ),
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: 'Skincare > Mask > Home Derma Treatment',
    additionalProperty: product.reset_moments?.map(m => ({
      '@type': 'PropertyValue',
      name: 'Reset Moment',
      value: m.name,
    })) || [],
  };

  if (product.price) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: 'KRW',
      price: product.price,
      availability: 'https://schema.org/InStock',
    };
  }

  return JSON.stringify(schema);
}

// ── HowTo JSON-LD (for Routine pages) ────────────────────────────────────────
export function generateHowToSchema(routine: DermaRoutine): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: routine.name,
    description: applySafeClaimLanguage(routine.expected_user_goal || ''),
    totalTime: `PT${routine.duration?.replace('시간', 'H') || '20M'}`,
    step: routine.steps.map((step) => ({
      '@type': 'HowToStep',
      position: step.order,
      name: step.title,
      text: step.instruction,
    })),
    ...(routine.caution && {
      warning: {
        '@type': 'Warning',
        text: routine.caution,
      },
    }),
  };
  return JSON.stringify(schema);
}

// ── Article JSON-LD (for Canon Clinic Logic articles) ────────────────────────
export function generateArticleSchema(params: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  authorName: string;
  authorType: 'Person' | 'Organization';
  brandName: string;
}): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: applySafeClaimLanguage(params.description),
    url: params.url,
    datePublished: params.publishedAt,
    author: {
      '@type': params.authorType,
      name: params.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: params.brandName,
    },
    about: {
      '@type': 'Thing',
      name: 'Home Derma Reset',
      description: 'Clinic-derived home skincare treatment for the interval between clinic visits.',
    },
  };
  return JSON.stringify(schema);
}

// ── AEO Metadata Generator ────────────────────────────────────────────────────
export interface AEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle: string;
  ogDescription: string;
}

export function generateMomentMeta(params: {
  momentName: string;
  userSituation: string;
  productName: string;
  tenantDomain: string;
  momentSlug: string;
}): AEOMetadata {
  return {
    title: `${params.momentName} | DR.O — ${params.userSituation}`,
    description: applySafeClaimLanguage(
      `${params.userSituation} DR.O ${params.productName}으로 집에서 간편하게 리셋하세요. ` +
      `클리닉 로직 기반 홈 더마 리셋 솔루션.`
    ),
    keywords: [params.momentName, params.userSituation, 'DR.O', params.productName, '홈케어', '시술 후 관리', 'home derma reset'],
    canonical: `https://${params.tenantDomain}/moments/${params.momentSlug}`,
    ogTitle: `${params.momentName} — DR.O 리셋 솔루션`,
    ogDescription: applySafeClaimLanguage(`${params.userSituation} DR.O ${params.productName}으로 정확하게 개입하세요.`),
  };
}

export function generateCompareMeta(params: { tenantDomain: string }): AEOMetadata {
  return {
    title: '메디텐션 vs 메디글로우 | DR.O Fit Split 비교',
    description: '메디텐션과 메디글로우는 우열이 없습니다. 리프팅/라인 리셋은 메디텐션, 토닝 후 열감·광채 리셋은 메디글로우. 상황 적합도로 선택하세요.',
    keywords: ['메디텐션 메디글로우 차이', '메디텐션 vs 메디글로우', 'DR.O 어떤 제품', '리프팅 후 마스크', '토닝 후 마스크'],
    canonical: `https://${params.tenantDomain}/compare`,
    ogTitle: 'DR.O 메디텐션 vs 메디글로우 — Fit Split 비교',
    ogDescription: '우열이 아닌 상황 분기. 당신의 리셋 모먼트에 맞는 제품을 찾아보세요.',
  };
}
