import { getTenantConfig } from "@/lib/tenant-config";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FileText, BarChart3, Image } from "lucide-react";

export default async function CMSCalendarPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  // Mocking calendar events
  const today = new Date().getDate();
  const mockEvents = [
    { day: today, title: "S/S 드레스 트렌드", type: "article" },
    { day: today + 2, title: "자연광 스튜디오 꿀팁", type: "answer_card" },
    { day: today + 5, title: "2026 예비부부 설문", type: "survey" },
  ];

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-indigo-600" /> 에디토리얼 캘린더
          </h1>
          <p className="text-slate-500 mt-1">
            발행 예정된 콘텐츠 일정을 확인하고 포맷 균형을 모니터링합니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-bold px-4">2026년 5월</span>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 shrink-0">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500">{day}</div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 4; // Mock starting offset
            const isCurrentMonth = dayNum > 0 && dayNum <= 31;
            const isToday = dayNum === today;
            const dayEvents = mockEvents.filter(e => e.day === dayNum);

            return (
              <div key={i} className={`border-r border-b border-slate-100 p-2 ${!isCurrentMonth ? 'bg-slate-50' : ''}`}>
                <div className={`text-xs font-semibold mb-2 ${isToday ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-500 px-1'}`}>
                  {isCurrentMonth ? dayNum : ''}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map((evt, idx) => (
                    <div key={idx} className={`text-[10px] p-1.5 rounded-lg flex items-center gap-1 font-semibold truncate cursor-pointer hover:opacity-80 transition-opacity ${
                      evt.type === 'article' ? 'bg-blue-100 text-blue-700' :
                      evt.type === 'survey' ? 'bg-fuchsia-100 text-fuchsia-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {evt.type === 'article' && <FileText className="w-3 h-3 shrink-0" />}
                      {evt.type === 'survey' && <BarChart3 className="w-3 h-3 shrink-0" />}
                      {evt.type === 'answer_card' && <FileText className="w-3 h-3 shrink-0" />}
                      <span className="truncate">{evt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
