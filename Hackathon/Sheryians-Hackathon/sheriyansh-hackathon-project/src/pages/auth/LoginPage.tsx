import React from 'react';
import { Link } from 'react-router-dom';
export const LoginPage: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center p-4">
    <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 max-w-md w-full text-center">
      <h2 className="text-2xl font-bold mb-4">Login to ProctorVision</h2>
      <p className="text-slate-400 mb-6">Choose your role to continue</p>
      <div className="flex flex-col gap-3">
        <Link to="/student" className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold">Continue as Student</Link>
        <Link to="/teacher" className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold">Continue as Teacher</Link>
      </div>
      <Link to="/" className="inline-block mt-6 text-sm text-slate-500 hover:text-cyan-400">← Back to Home</Link>
    </div>
  </div>
);
