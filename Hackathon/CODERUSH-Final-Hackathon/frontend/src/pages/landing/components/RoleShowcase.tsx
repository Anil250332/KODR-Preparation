import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Hospital, Droplet, Check, ArrowRight, Zap } from 'lucide-react';

type RoleKey = 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'BLOOD_BANK_OFFICER';

const roleDetails = {
  SUPER_ADMIN: {
    roleTitle: 'Super Admin Portal',
    subtitle: 'National Grid Governance & Regional Facility Approvals',
    desc: 'Supervise the entire interconnected hospital grid, audit all inter-hospital transactions, verify facility clinical licenses, and ensure zero unverified actors enter the emergency blood lifeline.',
    highlights: [
      'National facility compliance and state license verification',
      'Real-time emergency monitoring radar across all connected cities',
      'Cryptographic audit trails and regulatory incident logs',
      'Account privilege management and fraud prevention',
    ],
    stats: [
      { label: 'Verified Hospitals', value: '25', unit: 'Facilities' },
      { label: 'Active Alerts', value: '4', unit: 'Critical' },
      { label: 'Grid Integrity', value: '100%', unit: 'Monitored' },
    ],
    accent: 'from-violet-500 to-purple-600',
    accentLight: 'bg-violet-500/10 text-violet-300 border-violet-400/20',
    route: '/login',
  },
  HOSPITAL_ADMIN: {
    roleTitle: 'Hospital Administrator Desk',
    subtitle: 'Facility Staff Governance & Operational Metrics',
    desc: 'Empower hospital directors to manage institutional blood bank officers, update facility contact hotlines and licenses, and monitor monthly emergency fulfillment rates.',
    highlights: [
      'Clinical staff account provisioning and role privilege delegation',
      'Hospital profile maintenance, 24x7 blood bank status, and bed counts',
      'Monthly inter-hospital supply and receipt analytics with CSV export',
      'Emergency response turnaround oversight and KPI tracking',
    ],
    stats: [
      { label: 'Affiliated Staff', value: '14', unit: 'Accounts' },
      { label: 'Monthly Fulfillment', value: '98.4%', unit: 'Success' },
      { label: 'Avg Dispatch', value: '24', unit: 'Mins' },
    ],
    accent: 'from-sky-400 to-blue-500',
    accentLight: 'bg-sky-500/10 text-sky-300 border-sky-400/20',
    route: '/login',
  },
  BLOOD_BANK_OFFICER: {
    roleTitle: 'Blood Bank Operations Desk',
    subtitle: 'Real-Time Inventory Ledger & Emergency Broadcasts',
    desc: 'Designed specifically for chief blood bank officers. View incoming urgent broadcasts from nearby hospitals, commit available PRBC, Platelets or FFP units, and lock inventory securely.',
    highlights: [
      'Comprehensive 8-blood group stock ledger with component-level shelf-life tracking',
      'Real-time incoming emergency requirements filterable by proximity and urgency',
      'One-click unit offer submissions with estimated transit time calculations',
      'Atomic reservation locks with instant release if request is cancelled',
    ],
    stats: [
      { label: 'Available Stock', value: '142', unit: 'Bags' },
      { label: 'Locked Reserves', value: '18', unit: 'Units' },
      { label: 'Incoming Requests', value: '3', unit: 'Urgent' },
    ],
    accent: 'from-emerald-400 to-teal-500',
    accentLight: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    route: '/login',
  },
};

const tabs: { id: RoleKey; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'BLOOD_BANK_OFFICER', label: 'Blood Bank Officer', icon: Droplet },
  { id: 'HOSPITAL_ADMIN', label: 'Hospital Admin', icon: Hospital },
  { id: 'SUPER_ADMIN', label: 'Super Admin', icon: ShieldCheck },
];

export const RoleShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RoleKey>('BLOOD_BANK_OFFICER');
  const current = roleDetails[activeTab];

  return (
    <section id="roles" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
            Tailored Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Built for Healthcare Teams
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Granular, role-based workflows designed for high-stakes clinical emergencies.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/5 backdrop-blur-sm border border-slate-200/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm shadow-slate-900/8'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Card — Dark glass */}
        <div className="relative rounded-[2rem] overflow-hidden">
          {/* Dark teal glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#042f28] via-[#0a4f44] to-[#073d34]" />
          <div className="absolute inset-0 backdrop-blur-sm bg-white/[0.03]" />
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-teal-300/10 blur-3xl pointer-events-none -ml-10 -mb-10" />

          <div className="relative z-10 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left — Role info */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${current.accentLight}`}>
                  {current.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  {current.roleTitle}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed mt-3 font-normal max-w-lg">
                  {current.desc}
                </p>
              </div>

              {/* Highlights */}
              <ul className="space-y-2.5">
                {current.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center shrink-0 mt-0.5 shadow-md`}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-sm text-white/75 font-medium leading-snug">{h}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => navigate(current.route)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${current.accent} text-white font-bold text-xs shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl cursor-pointer`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch This Role in Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right — Stats glass panel */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/8 backdrop-blur-xl border border-white/12 p-6 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/35 mb-4">
                  Live Module Metrics
                </p>

                {current.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/6 border border-white/8 hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs font-medium text-white/55">{stat.label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white">{stat.value}</span>
                      <span className="text-[10px] font-bold text-white/40">{stat.unit}</span>
                    </div>
                  </div>
                ))}

                <div className="mt-2 p-3.5 rounded-xl bg-emerald-400/8 border border-emerald-400/15 flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">🔒</span>
                  <p className="text-[11px] text-emerald-300/80 font-medium leading-relaxed">
                    <strong className="text-emerald-300">Zero Cross-Hospital Data Leak.</strong>{' '}
                    Records isolated by hospital tenancy — HIPAA-aligned architecture.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
