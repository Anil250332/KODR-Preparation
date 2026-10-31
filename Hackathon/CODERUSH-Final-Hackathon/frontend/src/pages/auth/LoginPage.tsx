import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { loginSuccess, loginUserThunk } from '../../store/slices/authSlice';
import { DEMO_USERS } from '../../services/mockData';
import { UserRole } from '../../types';
import {
  Activity,
  ShieldCheck,
  Hospital,
  Droplet,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const demoAccounts = [
    {
      role: 'SUPER_ADMIN' as UserRole,
      title: 'Admin Login',
      user: DEMO_USERS.superAdmin,
      desc: 'National blood grid overview, hospital approvals & inter-hospital inventory visibility',
      icon: ShieldCheck,
      badge: 'Super Admin',
      route: '/super-admin/overview',
    },
    {
      role: 'HOSPITAL_ADMIN' as UserRole,
      title: 'Hospital Login',
      user: DEMO_USERS.hospitalAdmin,
      desc: 'Hospital Head: Officer management, hospital inventory, & emergency coordination',
      icon: Hospital,
      badge: 'Hospital Head',
      route: '/hospital-admin/overview',
    },
    {
      role: 'BLOOD_BANK_OFFICER' as UserRole,
      title: 'Blood Bank Officer',
      user: DEMO_USERS.bloodBankOfficer,
      desc: 'Hospital Officer: Manage blood inventory, accept network requests & broadcast emergency requests',
      icon: Droplet,
      badge: 'Blood Officer',
      route: '/blood-bank/overview',
    },
  ];

  const handleDemoLogin = async (account: (typeof demoAccounts)[0]) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const resultAction = await dispatch(loginUserThunk({ email: account.user.email, password: 'Password@123' }));
      if (loginUserThunk.fulfilled.match(resultAction)) {
        setIsLoading(false);
        navigate(account.route);
        return;
      }
    } catch {
      // Backend asleep or offline
    }
    dispatch(
      loginSuccess({
        user: account.user,
        token: 'demo-token-' + Date.now(),
      })
    );
    setIsLoading(false);
    navigate(account.route);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim() || 'Password@123';

    try {
      const resultAction = await dispatch(loginUserThunk({ email: cleanEmail, password: cleanPass }));
      if (loginUserThunk.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        setIsLoading(false);
        if (user.role === 'SUPER_ADMIN') {
          navigate('/super-admin/overview');
        } else if (user.role === 'HOSPITAL_ADMIN') {
          navigate('/hospital-admin/overview');
        } else {
          navigate('/blood-bank/overview');
        }
        return;
      }
    } catch {
      // Fallback
    }

    // Check cached registered hospital admins in localStorage
    try {
      const registeredAdmins = JSON.parse(localStorage.getItem('pulserelay_registered_admins') || '[]');
      const matchedLocal = registeredAdmins.find(
        (a: any) => a.email.toLowerCase() === cleanEmail && (!password || a.password === cleanPass)
      );
      if (matchedLocal) {
        dispatch(
          loginSuccess({
            user: matchedLocal.user,
            token: 'local-jwt-' + Date.now(),
          })
        );
        setIsLoading(false);
        navigate('/hospital-admin/overview');
        return;
      }
    } catch (err) {
      console.warn(err);
    }

    // Check cached registered hospital doctors/officers in localStorage
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('pulserelay_registered_users') || '[]');
      const matchedDoctor = registeredUsers.find(
        (a: any) => a.email.toLowerCase() === cleanEmail && (!password || a.password === cleanPass)
      );
      if (matchedDoctor) {
        dispatch(
          loginSuccess({
            user: matchedDoctor.user,
            token: 'local-jwt-' + Date.now(),
          })
        );
        setIsLoading(false);
        if (matchedDoctor.user.role === 'HOSPITAL_ADMIN') {
          navigate('/hospital-admin/overview');
        } else {
          navigate('/blood-bank/overview');
        }
        return;
      }
    } catch (err) {
      console.warn(err);
    }

    // Check DEMO_USERS
    const demoMatch = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (demoMatch) {
      dispatch(
        loginSuccess({
          user: demoMatch,
          token: 'demo-token-' + Date.now(),
        })
      );
      setIsLoading(false);
      if (demoMatch.role === 'SUPER_ADMIN') {
        navigate('/super-admin/overview');
      } else if (demoMatch.role === 'HOSPITAL_ADMIN') {
        navigate('/hospital-admin/overview');
      } else {
        navigate('/blood-bank/overview');
      }
      return;
    }

    setIsLoading(false);
    setErrorMessage('Invalid credentials or account not found. Please verify your email and password.');
  };

  return (
    <div className="min-h-screen bg-[#f0f7f6] flex flex-col justify-center items-center p-4 sm:p-8">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 mb-3 animate-hospital-pulse">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
          Pulse<span>Relay</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Hospital Blood Inventory & Inter-Centre Coordination Grid
        </p>
      </div>

      {/* Main Aligned Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Staff Sign In */}
          <div className="lg:col-span-5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
            <div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Secure Staff Portal</h2>
                <p className="text-xs text-slate-400 mt-1">Sign in with authorized clinical credentials</p>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@hospital.org"
                      className="block w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Password
                    </label>
                   
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="block w-full pl-10 pr-3.5 py-3 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#0d9488] hover:bg-[#0f766e] active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-teal-800/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                256-Bit TLS Encrypted
              </span>
              <span className="font-mono">v1.1 MVP</span>
            </div>
          </div>

          {/* Right Column: 1-Click Fast Role Selection (3 Clean Roles) */}
          <div className="lg:col-span-7 p-8 sm:p-10 bg-slate-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">1-Click Fast Role Selection</h2>
                  <p className="text-xs text-slate-400 mt-1">Select an authorized persona to launch dashboard</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  DEMO READY
                </span>
              </div>

              {/* 3 Balanced Cards */}
              <div className="mt-5 space-y-3">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  return (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => handleDemoLogin(account)}
                      className="w-full p-4 text-left rounded-2xl border border-slate-200/90 hover:border-[#0d9488] bg-white hover:bg-teal-50/30 transition-all duration-200 shadow-2xs group flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-[#0d9488] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-5 h-5 text-slate-600 group-hover:text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-slate-900 text-sm">{account.title}</h3>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              {account.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {account.desc}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-1">
                            {account.user.name} ({account.user.email})
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-1 text-xs font-bold text-[#0d9488] group-hover:translate-x-1 transition-transform">
                        <span>Launch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-2xl bg-white border border-slate-200/80 text-slate-500 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0d9488] shrink-0" />
              <span>
                <strong className="text-slate-800">Direct Role Access:</strong> Hospital Admins have complete inventory and user management, while Blood Bank Officers focus on component stock and emergency fulfillment.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
