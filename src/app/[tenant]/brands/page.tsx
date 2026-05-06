import React from 'react';
import Link from 'next/link';
import { getTenantConfig } from "@/lib/tenant-config";
import { Lock, ShieldCheck, Mail, ChevronRight, Globe, TrendingUp, Search } from 'lucide-react';

const MOCK_BRANDS = [
  { 
    id: "b1", 
    name: "Jeju Volcanic Skincare", 
    category: "K-Beauty / Cosmetics", 
    teaser: "100% natural volcanic ash from Jeju. Best-selling pore clearing line.",
    moq: "1,000 units",
    certifications: ["Vegan", "Cruelty-Free", "CPNP"],
    color: "bg-rose-100 text-rose-800"
  },
  { 
    id: "b2", 
    name: "Organic Matcha Farm", 
    category: "Food & Beverage", 
    teaser: "Premium ceremonial grade matcha grown in volcanic soil.",
    moq: "50 kg",
    certifications: ["USDA Organic", "Halal"],
    color: "bg-emerald-100 text-emerald-800"
  },
  { 
    id: "b3", 
    name: "Black Pork Jerky", 
    category: "Premium Snacks", 
    teaser: "Artisanal jerky made from Jeju's famous black pork.",
    moq: "5,000 packs",
    certifications: ["HACCP"],
    color: "bg-amber-100 text-amber-800"
  }
];

export default async function BrandsShowcasePage({ params }: { params: Promise<{ tenant: string }> }) {
  const p = await params;
  const tenantId = p.tenant || "phalanx";
  const tc = getTenantConfig(tenantId);

  if (tc.vertical !== "travel_global") {
    return (
      <div className="min-h-screen bg-slate-50 py-12 text-center">
        <h1 className="text-2xl font-bold">Brands Showcase</h1>
        <p>This vertical does not support the B2B Brands Showcase.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
            <Globe className="w-4 h-4" /> B2B Cross-border Trade
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Sourced from Jeju, Delivered Globally</h1>
          <p className="text-lg md:text-xl text-slate-600">
            Connect directly with verified local producers. Access exclusive wholesale margins and documentation through our secure Dealroom Vault.
          </p>
        </div>

        {/* Security Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-xl shadow-slate-900/10">
          <div className="flex items-start gap-4">
            <div className="bg-slate-800 p-3 rounded-full text-indigo-400 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Secure NDA-Protected Vault</h3>
              <p className="text-slate-400 text-sm">
                Sensitive information like FOB prices, exact margins, and proprietary certifications are locked. You must sign an electronic NDA to unlock the Vault.
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors shrink-0">
            Apply for Buyer Access
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['All Categories', 'K-Beauty', 'Food & Beverage', 'Lifestyle'].map((cat, i) => (
              <button key={cat} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${i === 0 ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search brands..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BRANDS.map(brand => (
            <div key={brand.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
              <div className={`h-32 ${brand.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                <span className="font-black text-2xl opacity-50 tracking-widest uppercase">{brand.name.substring(0, 4)}</span>
              </div>
              <div className="p-6 relative">
                {/* Lock Badge */}
                <div className="absolute -top-5 right-6 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border-2 border-white">
                  <Lock className="w-3 h-3" /> Vault Locked
                </div>

                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{brand.category}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{brand.name}</h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">{brand.teaser}</p>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">MOQ</span>
                    <span className="font-bold text-slate-900">{brand.moq}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Certifications</span>
                    <div className="flex gap-1">
                      {brand.certifications.map(c => (
                        <span key={c} className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-500">FOB Price</span>
                    <span className="text-indigo-600 font-black blur-[4px] select-none">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Retail Margin</span>
                    <span className="text-indigo-600 font-black blur-[4px] select-none">00%</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-white border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                  <Mail className="w-4 h-4" /> Request NDA to Unlock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
