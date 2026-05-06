import React from 'react';
import Link from 'next/link';
import { getTenantConfig } from "@/lib/tenant-config";
import { ArrowRight, Star, Heart, MapPin, Briefcase, Camera, User } from 'lucide-react';

const STORIES = [
  {
    id: 's1',
    persona: 'Digital Nomad',
    title: 'From Berlin to Jeju: 3 Months of Coding by the Ocean',
    client: 'Alex & Sarah (Software Engineers)',
    challenge: 'Needed reliable >500Mbps internet, but wanted to surf every morning.',
    solution: 'Curated a coliving space in Aewol with enterprise-grade mesh Wi-Fi and partnered with a local surf school.',
    result: 'Successfully deployed their startup MVP while catching waves 4 days a week.',
    imageColor: 'bg-blue-200',
    icon: <Briefcase className="w-5 h-5" />
  },
  {
    id: 's2',
    persona: 'Family',
    title: 'A Month in the Tangerine Fields',
    client: 'The Chens (Family of 4, Singapore)',
    challenge: 'Wanted an authentic rural experience but with modern healthcare access for their toddler.',
    solution: 'Secured a traditional stone house near Seogwipo city center, provided English-speaking pediatric contacts.',
    result: 'Kids learned to harvest tangerines; parents enjoyed peace of mind.',
    imageColor: 'bg-orange-200',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: 's3',
    persona: 'Culture Explorer',
    title: 'Immersed in the Haenyeo Heritage',
    client: 'Emma (Documentary Filmmaker, UK)',
    challenge: 'Needed long-term stay close to the Haenyeo (women divers) community with local translation support.',
    solution: 'Arranged a homestay in Hado-ri and connected with a bilingual local guide.',
    result: 'Filmed an award-winning short doc; became an honorary village member.',
    imageColor: 'bg-emerald-200',
    icon: <Camera className="w-5 h-5" />
  }
];

export default async function CasesPage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  if (tc.vertical !== "travel_global") {
    return (
      <div className="min-h-screen bg-slate-50 py-12 text-center">
        <h1 className="text-2xl font-bold">Stories & Cases</h1>
        <p>This vertical does not support the Stories gallery yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Global Nomad Stories</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Real experiences from travelers, remote workers, and families who found their perfect rhythm in Jeju through our Bespoke Concierge.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Filter by Vibe:</span>
          {['All Stories', 'Digital Nomad', 'Family', 'Culture Explorer', 'Adventure'].map((filter, i) => (
            <button key={filter} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${i === 0 ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {STORIES.map(story => (
            <article key={story.id} className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden flex flex-col md:flex-row group">
              {/* Image Placeholder */}
              <div className={`md:w-2/5 ${story.imageColor} relative min-h-[300px] flex items-center justify-center p-8 overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                <div className="w-24 h-24 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl text-slate-700">
                  {story.icon}
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-slate-800 tracking-wider shadow-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  {story.persona}
                </div>
              </div>

              {/* Content */}
              <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-sm font-bold text-orange-600 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Jeju Island
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 group-hover:text-orange-600 transition-colors">
                  {story.title}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">The Challenge</div>
                    <p className="text-slate-700 leading-relaxed font-medium">"{story.challenge}"</p>
                  </div>
                  <div className="pl-4 border-l-2 border-orange-200">
                    <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Our Solution</div>
                    <p className="text-slate-600 leading-relaxed">{story.solution}</p>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">The Result</div>
                    <p className="text-emerald-700 font-medium leading-relaxed bg-emerald-50 px-4 py-3 rounded-xl inline-block">
                      {story.result}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm text-slate-500 font-medium">
                    Client: {story.client}
                  </div>
                  <button className="text-orange-600 font-bold text-sm flex items-center gap-1 hover:text-orange-800 transition-colors">
                    Plan similar stay <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href={`/${tenantId}/bespoke`} className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-colors shadow-xl shadow-slate-900/20 text-lg gap-2">
            Start Your Own Story <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
