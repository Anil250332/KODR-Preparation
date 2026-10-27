import React from 'react';
import { Link } from 'react-router-dom';
export const TeacherDashboard: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white p-8">
    <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold">Teacher Invigilator Portal</h1>
      <Link to="/" className="text-sm text-slate-400 hover:text-white">← Back to Home</Link>
    </div>
    <div className="grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <Link to="/teacher/create-exam" className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/40">
        <h3 className="font-bold mb-2">Create Timed Test</h3>
        <p className="text-sm text-slate-400">Setup questions, duration & rules</p>
      </Link>
      <Link to="/teacher/live/ex_01" className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/40">
        <h3 className="font-bold mb-2">Live Invigilation</h3>
        <p className="text-sm text-slate-400">Socket.IO live connected students</p>
      </Link>
      <Link to="/teacher/tuning" className="p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/40">
        <h3 className="font-bold mb-2">Rule Tuning</h3>
        <p className="text-sm text-slate-400">Adjust false alarm thresholds</p>
      </Link>
    </div>
  </div>
);
