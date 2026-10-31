import React from 'react';
import {
  Lock,
  Zap,
  Split,
  Thermometer,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ClinicalFeatures: React.FC = () => {
  const features = [
    {
      title: 'Atomic Reservation Locks',
      desc: 'When an offer is accepted, blood units are instantly locked in MongoDB Atlas transactions. No two emergency surgeries can ever claim the same physical unit.',
      icon: Lock,
      badge: 'Zero Race Conditions',
      gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20',
      iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    },
    {
      title: 'Multi-Source Partial Allocation',
      desc: 'Can’t find 4 units in one facility? The grid aggregates available stock across multiple neighboring hospitals to fulfill urgent surgical demands simultaneously.',
      icon: Split,
      badge: 'Smart Grid Routing',
      gradient: 'from-teal-500/10 to-cyan-500/10 text-teal-600 border-teal-500/20',
      iconBg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    },
    {
      title: 'Real-Time WebSocket Sync',
      desc: 'Built on bidirectional Socket.IO channels. Emergency requests, incoming offers, and cancellations trigger instantaneous browser alerts without refreshing.',
      icon: Zap,
      badge: '< 100ms Latency',
      gradient: 'from-amber-500/10 to-emerald-500/10 text-amber-600 border-amber-500/20',
      iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    },
    {
      title: 'Cold-Chain Telemetry Guidance',
      desc: 'Target temperature tolerances (PRBC 2°C–6°C, Platelets 20°C–24°C, FFP & Cryo ≤ -18°C) are displayed and tracked throughout allocation.',
      icon: Thermometer,
      badge: 'Transit Safety',
      gradient: 'from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-500/20',
      iconBg: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
    },
    {
      title: 'CDSCO Compliance & Verification',
      desc: 'Unverified facilities cannot participate in the live transfer network until official state blood licenses and blood centre credentials are vetted.',
      icon: ShieldCheck,
      badge: 'Regulatory Vetted',
      gradient: 'from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-500/20',
      iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    },
    {
      title: 'Cryptographic Audit Trail',
      desc: 'Immutable logs of every requirement raised, offer submitted, officer identity, timestamp, and IP address for full clinical governance and post-op review.',
      icon: FileCheck2,
      badge: 'Immutable Governance',
      gradient: 'from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-500/20',
      iconBg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-[#0d9488] text-[11px] font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#0d9488]" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Engineered for High-Stakes Clinical Care
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium max-w-xl mx-auto">
            Architected to eliminate communication bottlenecks during critical golden hours with bank-grade reliability.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/70 hover:bg-white backdrop-blur-md rounded-3xl p-7 border border-teal-900/10 hover:border-teal-500/30 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Subtle top card glow */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shadow-xs ${feat.iconBg}`}>
                      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${feat.gradient}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-teal-950 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-700">
                  <span className="group-hover:translate-x-0.5 transition-transform">Clinical grade</span>
                  <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
