import Link from "next/link";
import { Search, Compass, MapPin, Building, Globe, ArrowRight, ShieldCheck, Waves } from "lucide-react";
import type { TenantConfig } from "@/lib/tenant-config";

const FEATURED_STAYS = [
  { slug: 'aewol-ocean-workspace', name: 'Aewol Ocean Workspace', location: 'Aewol, Jeju', type: 'Workation / Villa', price: '$120/night' },
  { slug: 'sungsan-eco-stay', name: 'Sungsan Eco Stay', location: 'Sungsan, Jeju', type: 'Long-stay / Guesthouse', price: '$60/night' },
  { slug: 'jeju-city-hub', name: 'Jeju City Digital Hub', location: 'Jeju-si', type: 'Coliving Space', price: '$80/night' },
];

const CANON_TOPICS = [
  { q: 'How to rent a car in Jeju without a Korean credit card?', slug: 'foreigner-car-rental' },
  { q: 'Top 5 coworking spaces with reliable internet in Jeju', slug: 'best-coworking-spaces' },
  { q: 'Halal and Vegan dining guide for Jeju Island', slug: 'halal-vegan-dining-guide' },
  { q: 'Understanding the Jeju Digital Nomad Visa requirements', slug: 'jeju-digital-nomad-visa' },
];

export default function JejutoHome({ tc, osUrl, tenantId }: { tc: TenantConfig, osUrl: string, tenantId: string }) {
  return (
    <div className="w-full bg-slate-50">
      {/* Hero */}
      <section className="relative pt-24 pb-28 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/2 pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 font-semibold text-sm">
            <Globe className="w-4 h-4" /> Global Cross-border Community
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-white">
            Surf. Code. Explore.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
              All on One Island.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            {tc.media.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${tenantId}/bespoke`} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
              Find My Perfect Stay <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={`/${tenantId}/canon`} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-lg px-8 py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
              Read the Survival Guide
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-black text-white">327+</div>
              <div className="text-sm text-slate-500 mt-1">Global Nomads Hosted</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">12</div>
              <div className="text-sm text-slate-500 mt-1">Countries Represented</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">45</div>
              <div className="text-sm text-slate-500 mt-1">Verified Local Hosts</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">100%</div>
              <div className="text-sm text-slate-500 mt-1">Secure Transactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Stays / Picks */}
      <section className="container mx-auto px-4 max-w-6xl -mt-10 relative z-20 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Curated Stays & Hubs</h2>
          <Link href={`/${tenantId}/bespoke`} className="text-sm font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1">
            Request Bespoke Stay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_STAYS.map((stay, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                    {stay.type}
                  </span>
                  <h3 className="text-white font-bold text-lg">{stay.name}</h3>
                </div>
                <Compass className="w-full h-full text-slate-300 object-cover absolute inset-0 p-10 opacity-50" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="text-sm text-slate-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {stay.location}
                </div>
                <div className="font-bold text-slate-900">{stay.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Survival Guide (AEO Canon) Preview */}
      <section className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">{tc.media.canonTitle}</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                {tc.media.canonSubtitle}
              </p>
              <Link href={`/${tenantId}/canon`} className="inline-flex items-center gap-2 font-bold text-orange-600 hover:text-orange-800">
                Browse Full Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CANON_TOPICS.map((topic, i) => (
                <Link key={i} href={`/${tenantId}/canon/${topic.slug}`}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group">
                  <span className="text-orange-500 font-black text-sm mb-2 block">Q.</span>
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-orange-700 transition-colors leading-snug">
                    {topic.q}
                  </h3>
                  <div className="mt-4 text-xs font-bold text-slate-400 flex items-center gap-1 group-hover:text-orange-500">
                    Read Answer <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
