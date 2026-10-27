import React from 'react';
import { Link } from 'react-router-dom';
export const ExamSessionPage: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">Exam in Progress (AI Monitoring Active)</h1>
    <Link to="/student/exam/ex_01/completed" className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl inline-block">
      Submit Exam
    </Link>
  </div>
);
