import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 30;

// Mock detail — in production, fetch from fact_cards by ID
const MOCK_DETAIL = {
  id: "w-1",
  category: "editorial",
  categoryLabel: "사설 / 오피니언",
  title: "당정분리, 이제는 시스템으로 완성할 때다",
  author: "편집위원회",
  date: "2026.05.01",
  readTime: "5 min read",
  body: `한국 정치에서 당정분리는 오랫동안 구호에 그쳐왔다. 집권 여당이 된 순간 대통령과 당 대표의 경계가 희미해지고, '소통'이라는 이름 아래 사실상 지시와 복종 관계가 형성되어 왔다.

헌법 제66조는 대통령이 행정부 수반임을 명시하고 있다. 국무총리 제도가 있음에도 실질적 내각 운영은 대통령실 중심으로 이루어진다. 이 구조에서 여당은 행정부의 하위 파트너가 된다.

당정분리의 핵심은 세 가지다. 첫째, 당 대표가 국무회의에 참석하지 않는다. 둘째, 국정 현안에 대한 당의 의견은 공식 채널(당정 협의회)을 통해서만 전달된다. 셋째, 공천권을 통한 의원 통제를 제도적으로 제한한다.

이 세 가지 원칙만 지켜도 한국 정치의 구조적 문제 상당수가 해소된다.`,
  proofUrls: ["https://www.law.go.kr/헌법"],
  verdict: "현행 헌법 해석상 당정분리는 의무가 아니나, 민주주의 원칙에 부합하는 관행으로 권장된다.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ articleId: string }>;
}): Promise<Metadata> {
  const { articleId } = await params;
  return {
    title: `${MOCK_DETAIL.title} | 웹진`,
    description: MOCK_DETAIL.body.slice(0, 120),
  };
}

export default async function WebzineArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const article = MOCK_DETAIL; // TODO: fetch from DB by articleId

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 px-4 max-w-3xl mx-auto">
        <Link
          href="/webzine"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          웹진으로 돌아가기
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 pb-20">
        {/* Article Meta */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            {article.categoryLabel}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
          </div>
        </header>

        {/* Verdict Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">검증 결론</p>
            <p className="text-sm text-blue-900 leading-relaxed">{article.verdict}</p>
          </div>
        </div>

        {/* Body */}
        <div className="prose prose-slate max-w-none space-y-4 mb-10">
          {article.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-slate-700 leading-relaxed text-base">
              {para}
            </p>
          ))}
        </div>

        {/* References */}
        {article.proofUrls.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">공식 근거 자료</h2>
            <ul className="space-y-2">
              {article.proofUrls.map((url, i) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  );
}
