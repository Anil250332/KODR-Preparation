import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Menu, X } from 'lucide-react';

interface RollingNavLinkProps {
  href: string;
  label: string;
}

const RollingNavLink: React.FC<RollingNavLinkProps> = ({ href, label }) => {
  const letters = label.split('');

  return (
    <a
      href={href}
      className="group relative inline-flex items-center overflow-hidden px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-teal-900 rounded-full hover:bg-teal-500/10 transition-colors duration-200 cursor-pointer select-none"
    >
      <span className="inline-flex overflow-hidden">
        {letters.map((char, i) => (
          <span
            key={i}
            className="relative inline-flex flex-col overflow-hidden leading-tight py-0.5"
          >
            {/* Primary Char */}
            <span
              className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[125%]"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>

            {/* Duplicate Char (rolls in from bottom) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 inline-flex items-center text-[#0d6659] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-[125%] group-hover:translate-y-0"
              style={{ transitionDelay: `${i * 18}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
};

export const LandingNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
        isScrolled ? 'pt-3 sm:pt-4 px-3 sm:px-6' : 'pt-0 px-0'
      }`}
    >
      <div
        className={`pointer-events-auto mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'max-w-5xl rounded-full bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-teal-950/5 px-4 sm:px-6 h-14'
            : 'max-w-7xl rounded-none bg-[#f0f7f6]/90 backdrop-blur-md border-b border-emerald-950/5 px-4 sm:px-8 h-20'
        }`}
      >
        <div className="flex items-center justify-between h-full">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div
              className={`rounded-2xl bg-linear-to-tr from-[#0d6659] to-[#14b8a6] flex items-center justify-center text-white shadow-md shadow-teal-900/15 group-hover:scale-105 transition-all duration-300 ${
                isScrolled ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-2xl'
              }`}
            >
              <Activity className={`text-white animate-pulse transition-all ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} />
            </div>
            <div>
              <span className={`font-black tracking-tight text-slate-900 transition-all ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                Pulse<span>Relay</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-0.5">
            <RollingNavLink href="#how-it-works" label="How It Works" />
            <RollingNavLink href="#simulator" label="Live Simulator" />
            <RollingNavLink href="#features" label="Clinical Features" />
            <RollingNavLink href="#roles" label="Hospital Roles" />
            <RollingNavLink href="#impact" label="Impact" />
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <button
              onClick={() => navigate('/login')}
              className={`font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 transition-all cursor-pointer ${
                isScrolled ? 'px-3 py-1.5 text-xs rounded-full' : 'px-4 py-2 text-xs rounded-xl'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`bg-[#0d9488] hover:bg-[#0f766e] active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-teal-800/20 flex items-center space-x-1.5 transition-all cursor-pointer group ${
                isScrolled
                  ? 'px-4 py-1.5 rounded-full'
                  : 'px-5 py-2.5 rounded-2xl'
              }`}
            >
              <span> Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto max-w-5xl mx-auto mt-2 px-5 pt-3 pb-6 space-y-3 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl sm:hidden animate-in fade-in slide-in-from-top-2">
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            How It Works
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            Live Simulator
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            Clinical Features
          </a>
          <a
            href="#roles"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0d9488]"
          >
            Hospital Roles
          </a>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="w-full py-2.5 rounded-full bg-[#0d9488] text-white font-bold text-xs text-center shadow-md shadow-teal-800/20"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
