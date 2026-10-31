import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#0d6659] to-[#14b8a6] flex items-center justify-center text-white">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Pulse<span className="">Relay</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-normal">
              PulseRelay is an emergency inter-hospital blood requisition and coordination infrastructure connecting certified blood banks, clinical teams, and trauma units into one cohesive life-saving grid.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 text-[11px] pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                CDSCO Standards
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                256-Bit TLS
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <a href="#how-it-works" className="hover:text-[#0d9488] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#simulator" className="hover:text-[#0d9488] transition-colors">
                  Live Match Simulator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#0d9488] transition-colors">
                  Clinical Features
                </a>
              </li>
              <li>
                <a href="#impact" className="hover:text-[#0d9488] transition-colors">
                  Measurable Impact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinical Roles */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Hospital Roles</h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <Link to="/login" className="hover:text-[#0d9488] transition-colors">
                  Super Admin Authority
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#0d9488] transition-colors">
                  Hospital Administrator
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#0d9488] transition-colors">
                  Blood Bank Officer
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#0d9488] transition-colors">
                  Staff Login Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Node Info */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">National Grid Hub</h4>
            <ul className="space-y-2 text-slate-500 text-[11px]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Delhi NCR Regional Grid, India</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 11 2658 8500 (24x7 Lifeline)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>grid@pulserelay.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[11px] gap-3">
          <p>© 2026 PulseRelay Healthcare Coordination Network. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-600 cursor-pointer">Clinical Governance Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Security Protocol</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">v1.1 MVP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
