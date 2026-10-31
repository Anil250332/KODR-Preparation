import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Building2, CheckCircle2, ShieldCheck, Zap, Droplet } from 'lucide-react';

interface BloodItem {
  group: string;
  component: string;
  units: number;
  max: number;
  status: 'Critical' | 'Stable' | 'Available' | 'Reserved';
  isShortage: boolean;
  accentGradient: string;
  badgeStyle: string;
  dotColor: string;
  hospitals: { name: string; units: number; distance: string }[];
  compatibility: string;
}

export const LiveBloodTicker: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>('B+');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const bloodData: BloodItem[] = [
    {
      group: 'O-',
      component: 'PRBC (Red Cells)',
      units: 14,
      max: 20,
      status: 'Critical',
      isShortage: true,
      accentGradient: 'from-rose-500 to-red-600',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotColor: 'bg-rose-500',
      compatibility: 'Universal Donor — compatible with all recipients in emergency protocols',
      hospitals: [
        { name: 'AIIMS Central Blood Bank', units: 6, distance: '2.4 km' },
        { name: 'Safdarjung Regional Center', units: 5, distance: '3.1 km' },
        { name: 'Fortis Escorts Blood Bank', units: 3, distance: '5.2 km' },
      ],
    },
    {
      group: 'O+',
      component: 'Whole Blood',
      units: 40,
      max: 50,
      status: 'Stable',
      isShortage: false,
      accentGradient: 'from-[#0d6659] to-[#0d9488]',
      badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dotColor: 'bg-emerald-500',
      compatibility: 'Compatible with O+, A+, B+, AB+ patients',
      hospitals: [
        { name: 'AIIMS Central Blood Bank', units: 18, distance: '2.4 km' },
        { name: 'Max Super Speciality', units: 12, distance: '6.8 km' },
        { name: 'Red Cross Blood Bank', units: 10, distance: '4.5 km' },
      ],
    },
    {
      group: 'A+',
      component: 'Platelets (SDP)',
      units: 28,
      max: 35,
      status: 'Available',
      isShortage: false,
      accentGradient: 'from-[#0d6659] to-[#0d9488]',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200/80',
      dotColor: 'bg-teal-500',
      compatibility: 'Compatible with A+, AB+ patients',
      hospitals: [
        { name: 'Safdarjung Regional Center', units: 15, distance: '3.1 km' },
        { name: 'Fortis Escorts Blood Bank', units: 13, distance: '5.2 km' },
      ],
    },
    {
      group: 'A-',
      component: 'Cryoprecipitate',
      units: 9,
      max: 20,
      status: 'Reserved',
      isShortage: false,
      accentGradient: 'from-amber-500 to-amber-600',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dotColor: 'bg-amber-500',
      compatibility: 'Compatible with A-, A+, AB-, AB+ patients',
      hospitals: [
        { name: 'AIIMS Central Blood Bank', units: 5, distance: '2.4 km' },
        { name: 'Max Super Speciality', units: 4, distance: '6.8 km' },
      ],
    },
    {
      group: 'B+',
      component: 'PRBC (Red Cells)',
      units: 35,
      max: 45,
      status: 'Available',
      isShortage: false,
      accentGradient: 'from-[#0d6659] to-[#0d9488]',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200/80',
      dotColor: 'bg-teal-500',
      compatibility: 'Compatible with B+, AB+ patients',
      hospitals: [
        { name: 'Red Cross Blood Bank', units: 20, distance: '4.5 km' },
        { name: 'Safdarjung Regional Center', units: 15, distance: '3.1 km' },
      ],
    },
    {
      group: 'B-',
      component: 'Platelets (RDP)',
      units: 7,
      max: 20,
      status: 'Critical',
      isShortage: true,
      accentGradient: 'from-rose-500 to-red-600',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dotColor: 'bg-rose-500',
      compatibility: 'Compatible with B-, B+, AB-, AB+ patients',
      hospitals: [
        { name: 'Fortis Gurugram Blood Center', units: 4, distance: '12.0 km' },
        { name: 'AIIMS Central Blood Bank', units: 3, distance: '2.4 km' },
      ],
    },
    {
      group: 'AB+',
      component: 'Fresh Frozen Plasma',
      units: 16,
      max: 25,
      status: 'Available',
      isShortage: false,
      accentGradient: 'from-[#0d6659] to-[#0d9488]',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200/80',
      dotColor: 'bg-teal-500',
      compatibility: 'Universal Recipient for red blood cells',
      hospitals: [
        { name: 'AIIMS Central Blood Bank', units: 9, distance: '2.4 km' },
        { name: 'Metro Heart Institute', units: 7, distance: '8.1 km' },
      ],
    },
    {
      group: 'AB-',
      component: 'Fresh Frozen Plasma',
      units: 8,
      max: 15,
      status: 'Available',
      isShortage: false,
      accentGradient: 'from-[#0d6659] to-[#0d9488]',
      badgeStyle: 'bg-teal-50 text-teal-800 border-teal-200/80',
      dotColor: 'bg-teal-500',
      compatibility: 'Ultra Rare Group — prioritized clinical allocation',
      hospitals: [
        { name: 'AIIMS Central Blood Bank', units: 5, distance: '2.4 km' },
        { name: 'Safdarjung Regional Center', units: 3, distance: '3.1 km' },
      ],
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const activeItem = bloodData.find((b) => b.group === selectedGroup);

  return (
    <section className="py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Telemetry Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-ping absolute"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                  Live Regional Blood Stock Telemetry (Delhi NCR)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Refreshes automatically via Socket.IO • 25+ connected hospital facilities
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              157 Bags Certified Active
            </span>
            <button
              onClick={handleRefresh}
              title="Refresh inventory"
              className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-500 hover:text-[#0d6659] hover:border-teal-300 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* 8 Glass Telemetry Cards — horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {bloodData.map((b) => {
            const percentage = Math.min(100, Math.round((b.units / b.max) * 100));
            const isSelected = selectedGroup === b.group;

            return (
              <div
                key={b.group}
                onClick={() => setSelectedGroup(isSelected ? null : b.group)}
                className={`group relative backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shrink-0 snap-start min-w-[160px] w-[160px] ${
                  isSelected
                    ? 'bg-white/80 border-[#0d6659]/40 shadow-lg shadow-teal-900/10 ring-1 ring-[#0d6659]/20 -translate-y-1'
                    : 'bg-white/55 border-white/60 hover:bg-white/75 hover:border-teal-300/60 hover:shadow-md hover:shadow-teal-900/5 hover:-translate-y-0.5'
                }`}
              >
                {/* Selected accent line */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#0d6659] to-[#0d9488]" />
                )}

                {/* Blood Group + Status */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.accentGradient} text-white font-black text-xs flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                    {b.group}
                  </div>
                  <span className={`inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded-full border leading-tight ${b.badgeStyle}`}>
                    {b.status}
                  </span>
                </div>

                {/* Units */}
                <div className="mt-3.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{b.units}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">u</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight truncate">
                    {b.component.split('(')[0].trim()}
                  </p>
                </div>

                {/* Gauge */}
                <div className="mt-3">
                  <div className="w-full h-1 rounded-full bg-black/8 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.isShortage ? 'bg-gradient-to-r from-rose-400 to-red-500' : 'bg-gradient-to-r from-[#0d6659] to-[#0d9488]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] font-mono text-slate-400">{percentage}%</span>
                    {b.isShortage
                      ? <span className="text-[8px] font-black text-rose-500 tracking-wider">LOW</span>
                      : <span className={`text-[9px] font-black flex items-center gap-0.5 transition-colors ${
                          isSelected ? 'text-[#0d6659]' : 'text-slate-300 group-hover:text-[#0d6659]'
                        }`}>
                          {isSelected ? '●' : '→'}
                        </span>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Command HUD / Detailed Inspector */}
        {activeItem && (
          <div className="mt-4 p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/60 shadow-lg shadow-teal-900/6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Left: Blood Group Badge & Clinical Info */}
            <div className="flex items-start space-x-4">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${activeItem.accentGradient} text-white font-black text-base flex items-center justify-center shadow-md shadow-teal-950/15 shrink-0`}
              >
                {activeItem.group}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-sm">
                    {activeItem.group} • {activeItem.component} Availability
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeItem.badgeStyle}`}
                  >
                    {activeItem.status} ({activeItem.units} Units Certified)
                  </span>
                </div>
                <p className="text-xs text-teal-800 font-medium mt-1">
                  Clinical Rule: {activeItem.compatibility}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Real-time stock verified across accredited centers with atomic reservation lock
                </p>
              </div>
            </div>

            {/* Middle: Connected Hospital Hubs with Badges */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">
                Verified Hubs:
              </span>
              {activeItem.hospitals.map((h) => (
                <div
                  key={h.name}
                  className="px-3 py-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1.5 text-xs font-semibold text-slate-800"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#0d6659]" />
                  <span className="truncate max-w-[140px]">{h.name.replace(' Central Blood Bank', '').replace(' Regional Center', '').replace(' Blood Bank', '')}</span>
                  <span className="font-mono text-[10px] font-black text-[#0d6659] bg-teal-50 px-1.5 py-0.5 rounded-md">
                    {h.units}u
                  </span>
                  <span className="text-[10px] text-slate-400">{h.distance}</span>
                </div>
              ))}
            </div>

            {/* Right: Instant Request CTA Button */}
            <div className="shrink-0 flex items-center">
              <a
                href="#simulator"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0d6659] to-[#0d9488] hover:from-[#08423a] hover:to-[#0d6659] text-white font-black text-xs shadow-lg shadow-teal-950/15 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-300" />
                <span>Simulate Urgent {activeItem.group} Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};



