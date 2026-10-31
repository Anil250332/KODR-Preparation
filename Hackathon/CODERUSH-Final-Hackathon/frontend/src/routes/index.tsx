import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { AppLayout } from '../layouts/AppLayout';

// Public Landing Page
import { LandingPage } from '../pages/landing/LandingPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Super Admin Pages
import { SuperAdminOverviewPage } from '../pages/super-admin/SuperAdminOverviewPage';
import { HospitalManagementPage } from '../pages/super-admin/HospitalManagementPage';
import { AdminHospitalInventoryPage } from '../pages/super-admin/AdminHospitalInventoryPage';
import { AdminEmergencyRequestsPage } from '../pages/super-admin/AdminEmergencyRequestsPage';
import { AdminProfilePage } from '../pages/super-admin/AdminProfilePage';

// Hospital Admin Pages
import { HospitalOverviewPage } from '../pages/hospital-admin/HospitalOverviewPage';
import { StaffManagementPage } from '../pages/hospital-admin/StaffManagementPage';
import { HospitalInventoryPage } from '../pages/hospital-admin/HospitalInventoryPage';
import { HospitalIncomingRequestsPage } from '../pages/hospital-admin/HospitalIncomingRequestsPage';
import { HospitalRaisedRequestsPage } from '../pages/hospital-admin/HospitalRaisedRequestsPage';
import { HospitalProfilePage } from '../pages/hospital-admin/HospitalProfilePage';

// Blood Bank Officer Pages
import { BloodBankOverviewPage } from '../pages/blood-bank/BloodBankOverviewPage';
import { BloodInventoryPage } from '../pages/blood-bank/BloodInventoryPage';
import { IncomingRequestsPage } from '../pages/blood-bank/IncomingRequestsPage';
import { OfficerMyRequestsPage } from '../pages/blood-bank/OfficerMyRequestsPage';

export const AppRoutes: React.FC = () => {
  const { activeRole } = useAppSelector((state) => state.auth);

  const getDefaultRouteForRole = () => {
    switch (activeRole) {
      case 'SUPER_ADMIN':
        return '/super-admin/overview';
      case 'HOSPITAL_ADMIN':
        return '/hospital-admin/overview';
      case 'BLOOD_BANK_OFFICER':
      default:
        return '/blood-bank/overview';
    }
  };

  return (
    <Routes>
      {/* Public Landing Page at Root */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route element={<AppLayout />}>
        {/* 1. Super Admin Dashboard Routes */}
        <Route path="/super-admin/overview" element={<SuperAdminOverviewPage />} />
        <Route path="/super-admin/hospitals" element={<HospitalManagementPage />} />
        <Route path="/super-admin/inventory" element={<AdminHospitalInventoryPage />} />
        <Route path="/super-admin/emergency-requests" element={<AdminEmergencyRequestsPage />} />
        <Route path="/super-admin/profile" element={<AdminProfilePage />} />

        {/* 2. Hospital Admin Dashboard Routes */}
        <Route path="/hospital-admin/overview" element={<HospitalOverviewPage />} />
        <Route path="/hospital-admin/users" element={<StaffManagementPage />} />
        <Route path="/hospital-admin/staff" element={<StaffManagementPage />} />
        <Route path="/hospital-admin/inventory" element={<HospitalInventoryPage />} />
        <Route path="/hospital-admin/incoming-requests" element={<HospitalIncomingRequestsPage />} />
        <Route path="/hospital-admin/raised-requests" element={<HospitalRaisedRequestsPage />} />
        <Route path="/hospital-admin/my-requests" element={<HospitalRaisedRequestsPage />} />
        <Route path="/hospital-admin/emergency-requests" element={<HospitalIncomingRequestsPage />} />
        <Route path="/hospital-admin/profile" element={<HospitalProfilePage />} />

        {/* 3. Blood Bank Officer Dashboard Routes */}
        <Route path="/blood-bank/overview" element={<BloodBankOverviewPage />} />
        <Route path="/blood-bank/inventory" element={<BloodInventoryPage />} />
        <Route path="/blood-bank/network-requests" element={<IncomingRequestsPage />} />
        <Route path="/blood-bank/incoming-requests" element={<IncomingRequestsPage />} />
        <Route path="/blood-bank/my-requests" element={<OfficerMyRequestsPage />} />
        <Route path="/blood-bank/create-request" element={<OfficerMyRequestsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
