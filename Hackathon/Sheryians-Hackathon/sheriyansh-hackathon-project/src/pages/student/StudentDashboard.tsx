import React from 'react';
import { Link } from 'react-router-dom';
export const StudentDashboard: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white p-8">
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <Link to="/" className="text-sm text-slate-400 hover:text-white">← Home</Link>
      </div>
      <p className="text-slate-400 mb-6">Upcoming & Active Exams</p>
      <Link to="/student/exam/ex_01/setup" className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold">
        Start Practice Exam →
      </Link>
    </div>
  </div>
);
