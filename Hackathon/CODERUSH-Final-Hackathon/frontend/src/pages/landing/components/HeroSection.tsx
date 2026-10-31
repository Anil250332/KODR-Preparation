import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
  Droplet,
} from 'lucide-react';
import CrystalizedBall from './CrystalizedBall';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-4 pb-16 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Hero Card */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-linear-to-br from-[#094e43] via-[#0d6659] to-[#043d35] text-white p-7 sm:p-10 lg:p-16 shadow-2xl shadow-teal-950/25 overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 sm:w-128 h-72 sm:h-128 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -mb-16 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Left — Text + CTAs */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Emergency Blood Aid.{' '}
                <span className="bg-linear-to-r from-emerald-300 via-teal-200 to-white bg-clip-text text-transparent">
                  Hospitals Helping Hospitals.
                </span>
              </h1>

              <p className="text-sm text-emerald-100/85 leading-relaxed max-w-xl">
                When a hospital faces an acute blood shortage for critical surgery or trauma, PulseRelay connects regional medical centers into a live emergency lifeline. Broadcast urgent blood needs, let peer hospitals instantly accept, and coordinate direct life-saving patient support.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3.5 rounded-2xl bg-white text-[#0d6659] hover:bg-emerald-50 font-black text-xs shadow-xl shadow-teal-950/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Enter Hospital Portals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#simulator"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-emerald-300" />
                  <span>Test Emergency Simulator</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100/75 pt-1">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Atomic Unit Locks
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  State License Verified
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  Real-Time Sockets
                </span>
              </div>
            </div>

            {/* Right — CrystalizedBall: hidden on mobile, visible lg+ */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
              <div className="w-full h-[500px] xl:h-[560px]">
                <CrystalizedBall
                  preset="aurora"
                  color="#5CFFC8"
                  size={0.88}
                  crackle={0.7}
                  flares={0.65}
                  glow={1.15}
                  sparks={0.75}
                  particleCount={18000}
                  fill={0.55}
                  interactive={true}
                  hoverStrength={0.85}
                  className="cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3 Stat Cards — clean spacing below hero with independent elevation */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              iconBg: 'bg-emerald-50',
              iconColor: 'text-[#0d9488]',
              badge: 'Speed',
              badgeStyle: 'text-emerald-800 bg-emerald-100',
              stat: '< 4.2 Mins',
              title: 'Average Network Response',
              desc: 'Nearby blood banks respond with confirmed unit allocations within minutes of broadcast.',
            },
            {
              icon: ShieldCheck,
              iconBg: 'bg-teal-50',
              iconColor: 'text-teal-600',
              badge: 'Security',
              badgeStyle: 'text-teal-800 bg-teal-100',
              stat: '100% Verified',
              title: 'Certified Participating Facilities',
              desc: 'State blood licenses and accredited testing standards vetted by the Super Admin authority.',
            },
            {
              icon: Droplet,
              iconBg: 'bg-rose-50',
              iconColor: 'text-rose-600',
              badge: 'Live Inventory',
              badgeStyle: 'text-rose-800 bg-rose-100',
              stat: '8 Rare Groups',
              title: 'Multi-Component Grid',
              desc: 'PRBC, Platelets, Whole Blood, FFP, and Cryo tracked across interconnected regional centres.',
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.badge}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-teal-950/5 border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-black tracking-wider uppercase ${card.badgeStyle} px-2.5 py-0.5 rounded-full`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-4 tracking-tight">{card.stat}</h3>
                <p className="text-xs font-bold text-slate-700 mt-1">{card.title}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
