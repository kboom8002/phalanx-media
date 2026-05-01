// 클라이언트 컴포넌트에서 사용하는 Supabase 세션 헬퍼
// VoteButtons.tsx 등에서 동적 import로 사용

import { createClient } from "@supabase/supabase-js";

let _session: string | null = null;

export function getSession(): string | null {
  return _session;
}

export function setSession(token: string | null) {
  _session = token;
}

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
