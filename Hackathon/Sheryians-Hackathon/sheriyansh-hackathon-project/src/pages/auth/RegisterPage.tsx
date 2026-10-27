import React from 'react';
import { Link } from 'react-router-dom';
export const RegisterPage: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white flex items-center justify-center">
    <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 max-w-md w-full text-center">
      <h2 className="text-2xl font-bold mb-2">Create ProctorVision Account</h2>
      <Link to="/login" className="text-cyan-400 text-sm">Already have an account? Login</Link>
    </div>
  </div>
);
