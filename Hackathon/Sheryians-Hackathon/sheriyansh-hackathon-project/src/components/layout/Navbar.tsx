import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import MagneticButton from '../common/MagneticButton';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 transition-all duration-300">
      <nav 
        className={`w-full max-w-5xl rounded-full transition-all duration-300 px-6 sm:px-8 py-3.5 flex items-center justify-between border ${
          scrolled
            ? 'bg-slate-950/85 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'bg-slate-900/40 backdrop-blur-md border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Neon Cyber Brand Logo */}
        <Link to="/" aria-label="ProctorVision Home" className="flex items-center group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden  transition-all duration-300 bg-slate-950 flex items-center justify-center shrink-0">
            <img
              src="/logo.jpg"
              alt="ProctorVision Neon Logo"
              className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Modern Capsule Navigation Bar with Liquid Fill Effect */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-950/70 border border-white/[0.08] backdrop-blur-md shadow-inner">
          {[
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Live Demo', href: '#demo' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative group/nav overflow-hidden px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium text-slate-300 cursor-pointer select-none transition-colors duration-200"
            >
              {/* Smooth Dark Liquid Fill Layer */}
              <span className="absolute inset-0 bg-gradient-to-b from-slate-800/95 via-slate-800/90 to-slate-900/95 border border-white/10 rounded-full translate-y-full group-hover/nav:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.5)]" />

              {/* Text */}
              <span className="relative z-10 transition-colors duration-300 text-slate-300 group-hover/nav:text-white">
                {item.label}
              </span>
            </a>
          ))}
        </div>

        {/* Only Login Button with Magnetic Effect */}
        <div className="hidden sm:flex items-center">
          <MagneticButton strength={0.3}>
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 via-violet-400 to-purple-400 hover:from-purple-400 hover:to-violet-300 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)] transition-all cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Glass Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 rounded-2xl p-5 bg-slate-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-4">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-purple-400 py-1 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-purple-400 py-1 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-purple-400 py-1 transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Live Demo
          </a>

          <div className="h-px bg-white/10 my-1" />

          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-violet-400 to-purple-400 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)]"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
};
