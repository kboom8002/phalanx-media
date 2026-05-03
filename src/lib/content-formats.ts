import type { Vertical } from './tenant-config';
import type { ContentFormat } from './content-types';

export interface FormatConfig {
  id: ContentFormat;
  label: string;
  icon: string;
  enabled: boolean;
  description: string;
}

export function getContentFormats(vertical: Vertical): Record<ContentFormat, FormatConfig> {
  const base: Record<ContentFormat, FormatConfig> = {
    article:      { id: 'article',      label: '아티클',         icon: 'Newspaper',   enabled: true,  description: '텍스트 중심의 긴 기사' },
    answer_card:  { id: 'answer_card',  label: '앤서카드',       icon: 'BookOpen',    enabled: true,  description: '구조화된 Q&A 형태' },
    survey:       { id: 'survey',       label: '설문조사',       icon: 'BarChart3',   enabled: false, description: '투표 및 리서치' },
    gallery:      { id: 'gallery',      label: '포토갤러리',     icon: 'Image',       enabled: false, description: '이미지 그리드/포트폴리오' },
    video:        { id: 'video',        label: '비디오',         icon: 'Film',        enabled: false, description: '영상 임베드/자막' },
    infographic:  { id: 'infographic',  label: '인포그래픽',     icon: 'TrendingUp',  enabled: false, description: '데이터 시각화 카드' },
    compare_card: { id: 'compare_card', label: 'Fit Split 비교', icon: 'GitCompare',  enabled: false, description: '상황별 제품 적합도 분기 비교' },
    routine_card: { id: 'routine_card', label: '루틴 가이드',    icon: 'ListOrdered', enabled: false, description: '단계별 리셋 루틴 안내' },
  };

  if (vertical === 'wedding') {
    base.survey.enabled    = true;
    base.gallery.enabled   = true;
    base.video.enabled     = true;
    base.article.label     = '매거진 기사';
    base.answer_card.label = '웨딩 가이드';
  }

  if (vertical === 'clinic_derma') {
    base.gallery.enabled      = true;
    base.video.enabled        = true;
    base.compare_card.enabled = true;
    base.routine_card.enabled = true;
    base.article.label        = 'Clinic Logic 백서';
    base.answer_card.label    = 'Answer Card';
    base.gallery.label        = 'Before & After 갤러리';
  }

  return base;
}
