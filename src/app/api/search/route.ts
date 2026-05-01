import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"
);

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const type = req.nextUrl.searchParams.get("type") || "all"; // all | factcard | expert | challenge

  if (!q.trim()) {
    return NextResponse.json({ results: [], query: q });
  }

  const results: any[] = [];

  // 1. Fact Cards (정답카드) fulltext search
  if (type === "all" || type === "factcard") {
    const { data: factCards } = await supabase
      .from("fact_cards")
      .select("id, canonical_question, answer, category, created_at")
      .eq("is_published", true)
      .or(`canonical_question.ilike.%${q}%,answer.ilike.%${q}%`)
      .limit(5);

    (factCards || []).forEach((fc: any) => {
      results.push({
        type: "factcard",
        id: fc.id,
        title: fc.canonical_question,
        excerpt: fc.answer?.slice(0, 100) + "...",
        category: fc.category,
        href: `/canon/${fc.id}`,
        badge: "정답카드",
      });
    });
  }

  // Fallback mock results when DB is empty
  if (results.length === 0) {
    const MOCK_RESULTS = [
      { type: "factcard", id: "w-1", title: "당정분리, 이제는 시스템으로 완성할 때다", excerpt: "한국 정치에서 당정분리는 오랫동안 구호에 그쳐왔다...", category: "정치 구조", href: "/webzine/w-1", badge: "웹진" },
      { type: "factcard", id: "w-2", title: "저출산 예산의 재구조화", excerpt: "현금 살포에서 인프라 구축으로 정책 방향을 전환해야 한다...", category: "복지·경제", href: "/canon/v1-chapter-3", badge: "정답카드" },
      { type: "expert", id: "e-1", title: "박형준 — 헌법법률 전문가", excerpt: "Authority Score 94.2 · 정치 구조 전문", category: "전문가", href: "/experts/hyungjun-park", badge: "전문가" },
      { type: "challenge", id: "ch-1", title: "우리 동네 정책 현장 포토 공모전", excerpt: "지역 정책이 실행되는 현장을 카메라에 담아주세요.", category: "챌린지", href: "/challenges", badge: "챌린지" },
    ].filter(r => r.title.includes(q) || r.excerpt.includes(q) || q.length < 2);

    // If query is too short or no match, return top 3 mock anyway
    results.push(...(MOCK_RESULTS.length > 0 ? MOCK_RESULTS : MOCK_RESULTS.slice(0, 3)));
  }

  return NextResponse.json({ results, query: q, total: results.length });
}
