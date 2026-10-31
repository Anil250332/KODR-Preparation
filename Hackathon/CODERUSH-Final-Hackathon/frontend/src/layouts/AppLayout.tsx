import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { fetchHospitals } from '../store/slices/hospitalSlice';
import { fetchEmergencyRequests } from '../store/slices/emergencySlice';
import { fetchHospitalInventory } from '../store/slices/inventorySlice';
import { fetchNotifications, fetchAuditLogs } from '../store/slices/notificationSlice';
import { checkServerHealth } from '../services/api';
import { setServerAwake } from '../store/slices/authSlice';

export const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkServerHealth().then((isHealthy) => {
      dispatch(setServerAwake(isHealthy));
    });

    dispatch(fetchHospitals());
    dispatch(fetchEmergencyRequests());
    dispatch(fetchNotifications());
    dispatch(fetchAuditLogs());

    const activeHospId =
      currentUser?.hospitalId && currentUser.hospitalId.length === 24
        ? currentUser.hospitalId
        : '6ae5bfa3a41657de36e25a1e';
    dispatch(fetchHospitalInventory(activeHospId));
  }, [dispatch, currentUser?.hospitalId]);

  return (
    <div className="min-h-screen bg-[#f0f7f6] flex flex-row font-sans">
      {/* Desktop Full-Height Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0d6659] text-white z-10 shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="font-extrabold text-sm text-white">Navigation</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Right Column: Header + Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
