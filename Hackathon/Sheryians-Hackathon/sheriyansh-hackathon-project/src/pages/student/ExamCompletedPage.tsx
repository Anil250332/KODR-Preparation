import React from 'react';
import { Link } from 'react-router-dom';
export const ExamCompletedPage: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white p-8 text-center flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-4 text-emerald-400">Exam Submitted Successfully</h1>
    <Link to="/student" className="text-cyan-400 underline">Return to Student Dashboard</Link>
  </div>
);
