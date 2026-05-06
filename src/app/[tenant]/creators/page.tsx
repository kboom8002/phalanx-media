import React from 'react';
import Link from 'next/link';
import { getTenantConfig } from "@/lib/tenant-config";
import { Trophy, Star, MapPin, UserPlus, ArrowRight, Activity } from 'lucide-react';

const CREATORS = [
  { id: "c1", slug: "alex-nomad", name: "Alex Chen", country: "SG", role: "Digital Nomad", level: "Platinum", points: "512K", joined: "2024", color: "from-slate-400 to-slate-300" },
  { id: "c2", slug: "sarah-surf", name: "Sarah Kim", country: "US", role: "Surf Instructor", level: "Gold", points: "245K", joined: "2024", color: "from-amber-400 to-amber-300" },
  { id: "c3", slug: "marco-food", name: "Marco Rossi", country: "IT", role: "Chef", level: "Gold", points: "210K", joined: "2025", color: "from-amber-400 to-amber-300" },
  { id: "c4", slug: "emma-doc", name: "Emma White", country: "UK", role: "Filmmaker", level: "Silver", points: "156K", joined: "2025", color: "from-slate-300 to-slate-200" },
  { id: "c5", slug: "jin-local", name: "Jin Park", country: "KR", role: "Local Expert", level: "Silver", points: "89K", joined: "2024", color: "from-slate-300 to-slate-200" },
];

export default async function CreatorsLeaderboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  if (tc.vertical !== "travel_global") {
    return (
      <div className="min-h-screen bg-slate-50 py-12 text-center">
        <h1 className="text-2xl font-bold">Creators Leaderboard</h1>
        <p>This vertical does not support the Creators Leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-6">
            <Trophy className="w-4 h-4" /> Local Creator Fleet
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">The Faces Behind Jeju</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Meet our verified local experts, digital nomads, and expats who are sharing the best of Jeju with the world. Connect with them for a Bespoke stay.
          </p>
        </div>

        {/* Live Activity Banner */}
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-12 shadow-md flex items-center justify-between border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Live Ecosystem</div>
              <div className="text-sm font-medium text-slate-700"><strong>45 Active Creators</strong> have completed <strong>128 missions</strong> this week.</div>
            </div>
          </div>
          <Link href={`/${tenantId}/login`} className="hidden md:flex text-orange-600 font-bold text-sm items-center gap-1 hover:text-orange-700 transition-colors">
            Join the Fleet <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Top 3 Podium (Visual placeholder) */}
        <div className="flex items-end justify-center gap-4 mb-16 h-64">
          {[CREATORS[1], CREATORS[0], CREATORS[2]].map((c, i) => (
            <div key={c.id} className="flex flex-col items-center w-1/3 max-w-[200px]">
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full shadow-xl mb-4 bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl font-black text-white border-4 border-white z-10 relative`}>
                {c.name.charAt(0)}
                <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                  {i === 0 ? '2' : i === 1 ? '1' : '3'}
                </div>
              </div>
              <div className={`w-full rounded-t-xl bg-gradient-to-b ${i === 1 ? 'from-orange-500 to-amber-500 h-40' : i === 0 ? 'from-slate-300 to-slate-200 h-32' : 'from-amber-600 to-amber-700 h-24'} shadow-lg flex flex-col items-center pt-4 px-2 text-white`}>
                <div className="font-bold text-sm truncate w-full text-center">{c.name}</div>
                <div className="text-[10px] opacity-80 mt-1">{c.points} pts</div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Global Ranking</h3>
            <span className="text-xs font-bold text-slate-400">Updated Hourly</span>
          </div>
          
          <div className="divide-y divide-slate-50">
            {CREATORS.map((creator, index) => (
              <div key={creator.id} className="p-4 md:p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                <div className="w-8 text-center font-black text-slate-300 text-lg group-hover:text-orange-500 transition-colors">
                  #{index + 1}
                </div>
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-inner bg-gradient-to-br ${creator.color}`}>
                  {creator.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-lg truncate">{creator.name}</h4>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{creator.country}</span>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {creator.role}</span>
                  </div>
                </div>
                
                <div className="text-right hidden md:block">
                  <div className="font-black text-orange-500 flex items-center justify-end gap-1 mb-1">
                    <Star className="w-4 h-4 fill-orange-500" /> {creator.points}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{creator.level}</div>
                </div>

                <Link href={`/${tenantId}/creators/${creator.slug}`} className="ml-4 w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shrink-0">
                  <UserPlus className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
