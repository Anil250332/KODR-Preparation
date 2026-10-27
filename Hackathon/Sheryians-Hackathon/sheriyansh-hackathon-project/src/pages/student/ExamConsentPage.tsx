import React from 'react';
import { Link } from 'react-router-dom';
export const ExamConsentPage: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white p-8 flex items-center justify-center">
    <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 max-w-lg w-full">
      <h2 className="text-2xl font-bold mb-3">Exam Consent & Privacy Notice</h2>
      <p className="text-slate-400 text-sm mb-6">Your camera performs local AI checks only. No continuous video stream leaves this device.</p>
      <Link to="/student/exam/ex_01/take" className="block text-center px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold">
        I Consent & Launch Test →
      </Link>
    </div>
  </div>
);
