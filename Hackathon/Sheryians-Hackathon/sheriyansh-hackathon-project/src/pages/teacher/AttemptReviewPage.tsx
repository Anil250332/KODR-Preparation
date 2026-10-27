import React from 'react';
import { Link } from 'react-router-dom';
export const AttemptReviewPage: React.FC = () => (
  <div className="min-h-screen bg-[#080c14] text-white p-8">
    <div className="max-w-4xl mx-auto">
      <Link to="/teacher" className="text-sm text-slate-400 hover:text-white mb-4 inline-block">← Back to Dashboard</Link>
      <h1 className="text-2xl font-bold">Attempt Review (Valid vs False Alarm)</h1>
    </div>
  </div>
);
