import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { kv } from '@vercel/kv';
import { updateSession } from '@/utils/supabase/middleware';

// Next.js 16: proxy.ts 컨벤션 (구 middleware.ts)
export async function proxy(request: NextRequest) {
  // Phase 5: Supabase Auth Session Refresh
  let response = NextResponse.next();
  try {
    response = await updateSession(request, response);
  } catch (e) {
    console.error('Supabase updateSession failed, continuing with mock auth', e);
  }

  const url = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  // ─── 0-A. 런타임 테넌트 해석 ───────────────────────────────
  // 우선순위: (1) ?tenant= 쿼리 (2) 서브도메인 (3) 쿠키 (4) 환경변수
  const KNOWN_TENANTS = ['phalanx', 'aihompy', 'kskincare', 'tfstudio', 'jejuto'];

  let resolvedTenant: string | null = null;

  // (1) 쿼리 파라미터: ?tenant=aihompy
  const tenantQuery = url.searchParams.get('tenant');
  if (tenantQuery && KNOWN_TENANTS.includes(tenantQuery)) {
    resolvedTenant = tenantQuery;
    url.searchParams.delete('tenant');
  }

  // (2) 서브도메인: aihompy.phalanx-os.vercel.app
  if (!resolvedTenant) {
    const host = request.headers.get('host') || '';
    const subdomain = host.split('.')[0];
    if (KNOWN_TENANTS.includes(subdomain)) {
      resolvedTenant = subdomain;
    }
  }

  // (3) 기존 쿠키
  if (!resolvedTenant) {
    resolvedTenant = request.cookies.get('pxos_tenant')?.value || null;
  }

  // (4) 환경변수 기본값
  const tenantId = resolvedTenant || process.env.NEXT_PUBLIC_TENANT_ID || 'phalanx';

  // 테넌트가 변경되었으면 쿠키 갱신 + (쿼리였으면 리다이렉트)
  const currentCookie = request.cookies.get('pxos_tenant')?.value;
  if (tenantQuery && resolvedTenant) {
    response = NextResponse.redirect(url);
    response.cookies.set('pxos_tenant', tenantId, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // ─── 0-B. Rate Limiting (Vercel KV) ────────────────────────
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const key = `rate_limit_${ip}`;
      const count = await kv.incr(key);
      if (count === 1) await kv.expire(key, 60);
      if (count > 30) {
        return new NextResponse(
          JSON.stringify({ error: 'Too Many Requests' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (err) {
    console.error('KV Rate Limit error', err);
  }

  // 테넌트 쿠키가 아직 없으면 응답에 세팅
  if (currentCookie !== tenantId) {
    response.cookies.set('pxos_tenant', tenantId, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  }

  const vgToken = request.cookies.get('vg_token')?.value;

  // 1. URL 토큰 주입 (?auth=vg → ACTIVIST, ?auth=exp → EXPERT)
  const authQuery = url.searchParams.get('auth');

  if (authQuery === 'vg') {
    url.searchParams.delete('auth');
    const res = NextResponse.redirect(url);
    res.cookies.set('vg_token', 'active_activist', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    // 역할 쿠키도 함께 설정
    res.cookies.set('mock_role', 'ACTIVIST', { path: '/', maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (authQuery === 'exp') {
    url.searchParams.delete('auth');
    const res = NextResponse.redirect(new URL('/expert', request.url));
    res.cookies.set('mock_role', 'EXPERT', { path: '/', maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (authQuery === 'principal') {
    url.searchParams.delete('auth');
    const res = NextResponse.redirect(new URL('/principal', request.url));
    res.cookies.set('mock_role', 'PRINCIPAL', { path: '/', maxAge: 60 * 60 * 24 * 30 });
    return res;
  }

  if (authQuery === 'clear') {
    url.searchParams.delete('auth');
    const res = NextResponse.redirect(url);
    res.cookies.delete('vg_token');
    res.cookies.delete('mock_role');
    return res;
  }

  // 2. RBAC 정책 엔진 — 7단계 역할 계층
  const mockRole = request.cookies.get('mock_role')?.value || 'SYSOP';

  const roleHierarchy: Record<string, number> = {
    SYSOP:       700,
    PRINCIPAL:   600,
    EXPERT:      500,
    STRATEGIST:  400,
    REGION_LEAD: 300,
    ACTIVIST:    200,
    CITIZEN:     100,
  };

  const userLevel = roleHierarchy[mockRole] || 0;

  // /admin — STRATEGIST 이상만 접근
  if (url.pathname.startsWith('/admin')) {
    if (userLevel < roleHierarchy['STRATEGIST']) {
      return NextResponse.redirect(new URL('/v-dash', request.url));
    }
  }

  // /principal — PRINCIPAL, SYSOP만 접근
  if (url.pathname.startsWith('/principal')) {
    if (userLevel < roleHierarchy['PRINCIPAL']) {
      return NextResponse.redirect(new URL('/v-dash', request.url));
    }
  }

  // /expert — EXPERT 이상만 접근
  if (url.pathname.startsWith('/expert')) {
    if (userLevel < roleHierarchy['EXPERT']) {
      return NextResponse.redirect(new URL('/v-dash', request.url));
    }
  }

  // /commander — REGION_LEAD 이상만 접근
  if (url.pathname.startsWith('/commander')) {
    if (userLevel < roleHierarchy['REGION_LEAD']) {
      return NextResponse.redirect(new URL('/v-dash', request.url));
    }
  }

  // /media — ACTIVIST 이상만 접근
  if (url.pathname.startsWith('/media')) {
    if (userLevel < roleHierarchy['ACTIVIST']) {
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://phalanx-media.vercel.app';
      return NextResponse.redirect(new URL(mediaUrl));
    }
  }

  // /v-dash — ACTIVIST 이상만 접근 (CITIZEN은 차단 → media로)
  if (url.pathname.startsWith('/v-dash')) {
    if (userLevel < roleHierarchy['ACTIVIST']) {
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://phalanx-media.vercel.app';
      return NextResponse.redirect(new URL(`${mediaUrl}/agora`));
    }
  }

  // 루트 / → 역할별 분기
  if (url.pathname === '/' || url.pathname === '/feed') {
    if (userLevel >= roleHierarchy['PRINCIPAL'] && mockRole === 'PRINCIPAL') {
      return NextResponse.rewrite(new URL('/principal', request.url));
    }
    if (userLevel >= roleHierarchy['EXPERT'] && mockRole === 'EXPERT') {
      return NextResponse.rewrite(new URL('/expert', request.url));
    }
    if (userLevel >= roleHierarchy['ACTIVIST'] || vgToken) {
      return NextResponse.rewrite(new URL('/v-dash', request.url));
    }
    if (url.pathname === '/') {
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://phalanx-media.vercel.app';
      return NextResponse.redirect(new URL(mediaUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/feed', '/v-dash/:path*', '/admin/:path*', '/principal/:path*', '/expert/:path*', '/commander/:path*', '/media/:path*', '/media'],
};
