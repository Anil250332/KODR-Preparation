import React from 'react';
import { Check } from 'lucide-react';

const metrics = [
  {
    label: 'Requisition Speed',
    value: '85% Faster',
    pct: 85,
    desc: 'Response slashed from 45 mins → 4.2 mins',
    color: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/30',
    dot: 'bg-emerald-400',
    textColor: 'text-emerald-400',
  },
  {
    label: 'Fulfillment Precision',
    value: '99.8% Match',
    pct: 99.8,
    desc: 'Component & rare subgroup suitability verified',
    color: 'from-teal-400 to-cyan-400',
    glow: 'shadow-teal-400/30',
    dot: 'bg-teal-400',
    textColor: 'text-teal-300',
  },
  {
    label: 'Double Allocation Conflicts',
    value: '0 Conflicts',
    pct: 100,
    desc: 'Atomic locks prevent units being promised twice',
    color: 'from-rose-400 to-red-500',
    glow: 'shadow-rose-500/30',
    dot: 'bg-rose-400',
    textColor: 'text-rose-400',
  },
];

const stats = [
  { value: '25+', label: 'Hospitals Connected' },
  { value: '1.8M', label: 'Patients Covered' },
  { value: '3.8m', label: 'Time to 1st Offer' },
];

const points = [
  {
    title: 'Multi-Centre Broadcast vs. Endless Calling',
    desc: 'One emergency broadcast alerts all nearby verified blood banks simultaneously.',
  },
  {
    title: 'Partial Quantity Allocation Support',
    desc: 'Multi-source fulfillment across hospitals for partial unit requirements.',
  },
  {
    title: 'Immutable Audit Logs',
    desc: 'Every allocation and timestamp is logged for clinical governance & CDSCO compliance.',
  },
];

export const ImpactMetrics: React.FC = () => {
  return (
    <section id="impact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left — Green Glass Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-[2rem] overflow-hidden">
              {/* Dark green glass base */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#043d35] via-[#0d6659] to-[#094e43] rounded-[2rem]" />
              {/* Glass shimmer overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-[2rem]" />
              {/* Ambient glow blobs */}
              <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-teal-300/15 blur-2xl pointer-events-none" />

              <div className="relative z-10 p-8 sm:p-10">
                {/* Label */}
                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-400/10 border border-emerald-400/25 px-3 py-1 rounded-full">
                  Measurable Clinical Impact
                </span>

                <h2 className="mt-4 text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Transforming Critical<br />
                  <span className="text-emerald-300">Blood Logistics</span>
                </h2>

                {/* Metric bars */}
                <div className="mt-8 space-y-5">
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2 text-xs font-semibold text-white/80">
                          <span className={`w-2 h-2 rounded-full ${m.dot} shrink-0`} />
                          {m.label}
                        </span>
                        <span className={`text-xs font-black ${m.textColor}`}>{m.value}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${m.color} shadow-lg ${m.glow}`}
                          style={{ width: `${m.pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-white/40 mt-1.5">{m.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Stat row */}
                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <span className="text-2xl font-black text-white block">{s.value}</span>
                      <span className="text-[10px] text-white/45 font-medium mt-0.5 block leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Text + Points */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                The Reality Gap
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Why Static Stock Portals Fail During Critical Trauma
              </h3>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                Traditional portals like e-RaktKosh provide static listings. When acute hemorrhage hits the OR, surgeons need a real-time coordination protocol — not a phonebook.
              </p>
            </div>

            <div className="space-y-3">
              {points.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-100/80 shadow-sm hover:shadow-md hover:border-teal-200/60 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#0d6659] to-[#0d9488] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-teal-900/15">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
