import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f6] flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 mb-3 animate-hospital-pulse">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          Reset Credentials
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
          Enter your institutional hospital email to receive reset instructions
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
        {submitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verification Link Dispatched</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If an account exists for <strong className="text-slate-700">{email}</strong>, a secure password reset link has been dispatched with a 15-minute expiry token.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0d9488] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@aiims.edu.in"
                  className="block w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs shadow-md shadow-teal-800/20 transition-all cursor-pointer"
            >
              Send Password Reset Instructions
            </button>

            <div className="text-center pt-3">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-[#0d9488]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
