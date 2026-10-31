import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import {
  LayoutDashboard,
  Building2,
  Users,
  Radio,
  UserCheck,
  Building,
  Droplet,
  Inbox,
  PlusCircle,
  Activity,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeRole, currentUser } = useAppSelector((state) => state.auth);
  const { requests } = useAppSelector((state) => state.emergency);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const currentHospitalName =
    currentUser?.hospitalName ||
    hospitals.find((h) => h.id === currentUser?.hospitalId)?.name ||
    (activeRole === 'SUPER_ADMIN' ? 'National Blood Grid' : 'Medical Centre');

  const handleLogout = () => {
    dispatch(logout());
    if (onCloseMobile) onCloseMobile();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (activeRole) {
      case 'SUPER_ADMIN':
        return [
          { name: 'Dashboard', path: '/super-admin/overview', icon: LayoutDashboard },
          { name: 'Hospital Management', path: '/super-admin/hospitals', icon: Building2 },
          { name: 'Hospital Inventory', path: '/super-admin/inventory', icon: Droplet },
          { name: 'Emergency Requests', path: '/super-admin/emergency-requests', icon: Radio },
          { name: 'Profile Update', path: '/super-admin/profile', icon: UserCheck },
        ];
      case 'HOSPITAL_ADMIN':
        return [
          { name: 'Dashboard', path: '/hospital-admin/overview', icon: LayoutDashboard },
          { name: 'User Management', path: '/hospital-admin/users', icon: Users },
          { name: 'Hospital Inventory', path: '/hospital-admin/inventory', icon: Droplet },
          { name: 'Incoming Requests', path: '/hospital-admin/incoming-requests', icon: Inbox },
          { name: 'Raised by Us', path: '/hospital-admin/raised-requests', icon: Radio },
          { name: 'Hospital Profile', path: '/hospital-admin/profile', icon: Building },
        ];
      case 'BLOOD_BANK_OFFICER':
      default:
        return [
          { name: 'Officer Dashboard', path: '/blood-bank/overview', icon: LayoutDashboard },
          { name: 'Blood Inventory', path: '/blood-bank/inventory', icon: Droplet },
          { name: 'Incoming Requests', path: '/blood-bank/incoming-requests', icon: Inbox },
          { name: 'Raised by Us', path: '/blood-bank/my-requests', icon: PlusCircle },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-[#0d6659] text-white flex flex-col h-screen sticky top-0 select-none shadow-xl shrink-0 z-30">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
          <Activity className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
            Pulse<span className="text-emerald-300">Relay</span>
          </span>
          <p className="text-[10px] text-emerald-200/80 font-medium">Emergency Blood Grid</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto sidebar-scroll">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm font-bold backdrop-blur-xs translate-x-1'
                    : 'text-emerald-100/75 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 opacity-90" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info & Prominent Logout */}
      <div className="p-4 border-t border-white/10 text-[11px] text-emerald-200/70 space-y-3">
        <div className="min-w-0">
          <p className="font-bold text-white text-xs truncate">{currentUser?.name || 'User'}</p>
          <p className="text-[10px] text-emerald-200/60 truncate mt-0.5">
            {currentHospitalName}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-emerald-100 hover:text-white border border-white/15 hover:border-rose-400/40 text-xs font-bold transition-all cursor-pointer group"
        >
          <LogOut className="w-4 h-4 text-emerald-200 group-hover:text-rose-300" />
          <span>Sign Out</span>
        </button>

        <p className="text-[9px] text-emerald-300/40 text-center font-mono">© 2026 PulseRelay v1.1.0</p>
      </div>
    </aside>
  );
};
