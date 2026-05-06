import React from 'react';
import Link from 'next/link';
import { getTenantConfig } from "@/lib/tenant-config";
import { Star, MapPin, CheckCircle, Video, MessageSquare, ArrowRight, Calendar } from 'lucide-react';

export default async function CreatorProfilePage({ params }: { params: Promise<{ tenant: string, slug: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const slug = p.slug;
  const tc = getTenantConfig(tenantId);

  if (tc.vertical !== "travel_global") {
    return (
      <div className="min-h-screen bg-slate-50 py-12 text-center">
        <h1 className="text-2xl font-bold">Creator Profile</h1>
        <p>This vertical does not support Creator Profiles.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover Profile */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 pt-24 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-amber-400 to-amber-300 flex items-center justify-center text-5xl font-black text-white border-4 border-slate-900 shadow-2xl">
            A
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-3 border border-orange-500/30">
              <Star className="w-3.5 h-3.5 fill-orange-400" /> Platinum Creator
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Alex Chen</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Based in Aewol, Jeju</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined 2024</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-bold">Singapore</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column (Stats & CTA) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Points</div>
                  <div className="text-3xl font-black text-orange-500">512,000</div>
                </div>
                <div className="h-px bg-slate-100"></div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Missions Completed</div>
                  <div className="text-3xl font-black text-slate-900">47</div>
                </div>
                <div className="h-px bg-slate-100"></div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Digital Nomad</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Tech Startups</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">Surfing</span>
                  </div>
                </div>
              </div>

              <Link href={`/${tenantId}/bespoke`} className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg">
                Request as Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (Content Portfolio) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Recent Contributions
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-1">"Why Aewol is the best place to code" - TikTok</div>
                    <p className="text-sm text-slate-500 mb-2">Generated 45K views and 1.2K saves. Highlighted the fast internet and ocean views.</p>
                    <div className="text-xs text-orange-500 font-bold">+15,000 pts • 2 days ago</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 mb-1">Google Maps Review: Ocean Workspace</div>
                    <p className="text-sm text-slate-500 mb-2">Detailed English review of the coworking space amenities.</p>
                    <div className="text-xs text-orange-500 font-bold">+8,000 pts • 1 week ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
