import React from 'react';
import { Radio, Search, CheckCircle2, ShieldCheck } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Broadcast Requirement',
    desc: 'Clinical staff select blood group, required units, and urgency level. A structured digital beacon broadcasts across the hospital network instantly.',
    icon: Radio,
    accent: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/25',
  },
  {
    num: '02',
    title: 'Instant Network Discovery',
    desc: 'Participating blood centres within the regional grid receive high-priority alerts with matching stock availability and estimated transit times.',
    icon: Search,
    accent: 'from-teal-400 to-cyan-500',
    glow: 'shadow-teal-500/25',
  },
  {
    num: '03',
    title: 'Offer Submission & Lock',
    desc: 'Blood banks submit unit commitments. The requesting facility accepts allocation — instantly locking units to prevent any double-reservation.',
    icon: CheckCircle2,
    accent: 'from-sky-400 to-blue-500',
    glow: 'shadow-sky-500/25',
  },
  {
    num: '04',
    title: 'Verified Transit & Audit',
    desc: 'Dispatched units are tracked under cold-chain parameters. The full transaction is permanently recorded in immutable audit logs.',
    icon: ShieldCheck,
    accent: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/25',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
            Emergency Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            How PulseRelay Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            From critical trauma alarm to verified unit reservation in four seamless stages.
          </p>
        </div>

        {/* Steps — connected flow */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-emerald-300 via-teal-300 to-violet-300 opacity-40" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative bg-white rounded-2xl p-6 border border-slate-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Step number bg watermark */}
                <span className="absolute top-4 right-5 text-4xl font-black text-slate-100 select-none leading-none">
                  {step.num}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.accent} flex items-center justify-center shadow-lg ${step.glow} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 mt-5 tracking-tight">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{step.desc}</p>

                {/* Bottom accent */}
                <div className={`mt-5 h-0.5 rounded-full bg-gradient-to-r ${step.accent} opacity-30 group-hover:opacity-70 transition-opacity`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
