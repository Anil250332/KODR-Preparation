import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Activity } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] bg-linear-to-r from-[#0d6659] via-[#0f766e] to-[#044e43] text-white p-8 sm:p-14 lg:p-16 shadow-2xl shadow-teal-900/20 overflow-hidden text-center sm:text-left flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold mb-4">
              <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>National Healthcare Innovation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to Connect Your Facility to the Lifeline Grid?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
              Join leading hospital networks across Delhi NCR. Experience sub-4 minute emergency matching, automated atomic unit reservations, and complete cold-chain audit governance.
            </p>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-4 rounded-2xl bg-white text-[#0d6659] hover:bg-emerald-50 font-black text-xs shadow-xl shadow-teal-950/20 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Launch Dashboard Demo</span>
              <ArrowRight className="w-4 h-4 text-[#0d6659]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
