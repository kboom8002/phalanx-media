export type ContentFormat = 
  | 'article' 
  | 'answer_card' 
  | 'survey' 
  | 'gallery' 
  | 'video' 
  | 'infographic'
  | 'compare_card'   // Fit Split — two or more products by situation
  | 'routine_card';  // Step-by-step reset routine guide

export type ContentStatus = 'draft' | 'review' | 'approved' | 'published' | 'rejected';
export type ContentTier = 'official' | 'expert_verified' | 'community';

export interface ContentAsset {
  id: string;
  tenant_id: string;
  format: ContentFormat;
  tier: ContentTier;
  status: ContentStatus;
  title: string;
  slug: string;
  body: Record<string, any>;
  category: string;
  tags: string[];
  author_id: string;
  author_role: string;
  reviewer_id?: string;
  reviewer_comment?: string;
  published_at?: string;
  scheduled_at?: string;
  seo_meta?: { title: string; description: string; og_image?: string };
  version: number;
  created_at: string;
  updated_at: string;
}
