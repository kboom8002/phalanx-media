export type Role = 'SYSOP' | 'PRINCIPAL' | 'EXPERT' | 'STRATEGIST' | 'REGION_LEAD' | 'ACTIVIST' | 'CITIZEN';

export interface ContentPermission {
  create: boolean | 'draft_only';
  review: boolean;
  approve: boolean;
  desk: boolean | 'read';
  survey_create: boolean;
}

export const PERMISSION_MATRIX: Record<Role, ContentPermission> = {
  SYSOP:       { create: true, review: true, approve: true, desk: true, survey_create: true },
  PRINCIPAL:   { create: true, review: true, approve: true, desk: true, survey_create: true },
  EXPERT:      { create: true, review: true, approve: false, desk: 'read', survey_create: false },
  STRATEGIST:  { create: true, review: false, approve: false, desk: 'read', survey_create: true },
  REGION_LEAD: { create: true, review: true, approve: false, desk: false, survey_create: false },
  ACTIVIST:    { create: 'draft_only', review: false, approve: false, desk: false, survey_create: false },
  CITIZEN:     { create: false, review: false, approve: false, desk: false, survey_create: false },
};

export function canCreateContent(role: string): boolean {
  return PERMISSION_MATRIX[role as Role]?.create !== false;
}

export function canReviewContent(role: string): boolean {
  return PERMISSION_MATRIX[role as Role]?.review === true;
}

export function canAccessDesk(role: string): boolean {
  return PERMISSION_MATRIX[role as Role]?.desk !== false;
}
