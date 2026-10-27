import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { ExamConsentPage } from '../pages/student/ExamConsentPage';
import { ExamSessionPage } from '../pages/student/ExamSessionPage';
import { ExamCompletedPage } from '../pages/student/ExamCompletedPage';
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { CreateExamPage } from '../pages/teacher/CreateExamPage';
import { LiveInvigilationPage } from '../pages/teacher/LiveInvigilationPage';
import { AttemptReviewPage } from '../pages/teacher/AttemptReviewPage';
import { RuleTuningPage } from '../pages/teacher/RuleTuningPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Portal */}
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/exam/:examId/setup" element={<ExamConsentPage />} />
      <Route path="/student/exam/:examId/take" element={<ExamSessionPage />} />
      <Route path="/student/exam/:examId/completed" element={<ExamCompletedPage />} />

      {/* Teacher Portal */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/create-exam" element={<CreateExamPage />} />
      <Route path="/teacher/live/:examId" element={<LiveInvigilationPage />} />
      <Route path="/teacher/review/:attemptId" element={<AttemptReviewPage />} />
      <Route path="/teacher/tuning" element={<RuleTuningPage />} />
    </Routes>
  );
};
