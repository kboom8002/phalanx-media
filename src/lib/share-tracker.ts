// Social Share Tracking & UTM Utility

export interface ShareData {
  tenantId: string;
  contentId: string;
  slug: string;
  ambassadorId?: string;
  channel: 'kakao' | 'instagram' | 'blog' | 'copy';
}

export function generateShareUrl(data: ShareData): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:3001';
  const url = new URL(`/${data.tenantId}/webzine/${data.slug}`, baseUrl);
  
  // Attach UTM and referral parameters
  url.searchParams.append('utm_source', data.channel);
  url.searchParams.append('utm_medium', 'ambassador_share');
  if (data.ambassadorId) {
    url.searchParams.append('ref', data.ambassadorId);
  }

  return url.toString();
}

export async function logShareEvent(data: ShareData): Promise<void> {
  // In production, this would send an event to Supabase telemetry table
  console.log('[Telemetry] Content Shared:', data);
  // Example fetch:
  // await fetch('/api/telemetry/share', { method: 'POST', body: JSON.stringify(data) });
}
