import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { apiService } from '../../services/apiService';
import { BloodInventoryItem } from '../../types';
import {
  Building2,
  Users,
  Droplet,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HospitalOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const { requests } = useAppSelector((state) => state.emergency);

  const hospitalId = currentUser?.hospitalId || '6ae5bfa3a41657de36e25a1d';
  const currentHosp = hospitals.find((h) => h.id === hospitalId);
  const hospitalName = currentHosp?.name || currentUser?.hospitalName || 'City Care Hospital';

  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [officerCount, setOfficerCount] = useState<number>(4);

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
    apiService.getHospitalInventory(hospitalId).then(setInventory).catch(() => {});
    apiService.getUsers(hospitalId).then((users) => setOfficerCount(users.length || 4)).catch(() => {});
  }, [dispatch, hospitalId]);

  const totalAvailableUnits = inventory.reduce((acc, curr) => acc + curr.availableUnits, 0);

  const incomingRequests = requests.filter(
    (r) => r.requestingHospitalId !== hospitalId && r.status === 'SEARCHING'
  );

  const acceptedRequests = requests.filter(
    (r) => r.acceptedByHospitalId === hospitalId || (r.status === 'ACCEPTED' && r.acceptedByHospitalName?.includes(hospitalName))
  );

  const ourRequests = requests.filter(
    (r) => r.requestingHospitalId === hospitalId || r.requestingHospitalName?.includes(hospitalName)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{hospitalName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
              {currentHosp?.verified ? 'VERIFIED' : 'ACTIVE'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 font-medium flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {currentHosp ? `${currentHosp.address}, ${currentHosp.city}` : 'Indore, Madhya Pradesh'}
            </span>
            <span>•</span>
            <span>License: {currentHosp?.licenseNumber || 'MP-IND-2024-0019'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <button
            onClick={() => navigate('/hospital-admin/raised-requests')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Raise Emergency</span>
          </button>
          <button
            onClick={() => navigate('/hospital-admin/users')}
            className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Manage Officers</span>
          </button>
          <button
            onClick={() => navigate('/hospital-admin/profile')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-2xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 4 Clean Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="In-House Blood Units"
          value={totalAvailableUnits}
          subtitle="Real-time stored blood units"
          icon={Droplet}
          color="teal"
        />
        <StatCard
          title="Hospital Officers"
          value={officerCount}
          subtitle="Assigned under this hospital"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Incoming Emergencies"
          value={incomingRequests.length}
          subtitle="Hospitals awaiting blood support"
          icon={Radio}
          color="rose"
        />
        <StatCard
          title="Emergencies Helped"
          value={acceptedRequests.length}
          subtitle="Requests accepted by this centre"
          icon={HeartHandshake}
          color="blue"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hospital Blood Stock Reserves */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Hospital Blood Reserves</h2>
              <p className="text-xs text-slate-400 mt-0.5">Current component stock availability</p>
            </div>
            <button
              onClick={() => navigate('/hospital-admin/inventory')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 cursor-pointer"
            >
              <span>Full Inventory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {inventory.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">{item.bloodGroup}</span>
                  <span className="text-[10px] font-bold text-[#0d9488] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                    {item.component}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-black text-slate-900">{item.availableUnits}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inter-Hospital Emergency Help Activity */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Emergency Network Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Urgent broadcasts seeking help across hospitals</p>
            </div>
            <button
              onClick={() => navigate('/hospital-admin/incoming-requests')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {incomingRequests.slice(0, 3).map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center border border-rose-100">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {req.requiredUnits} Units {req.component}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Requested by {req.requestingHospitalName} ({req.requestingHospitalCity || 'Indore'})
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={req.urgency} />
                </div>
              </div>
            ))}
            {incomingRequests.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">
                No open emergency alerts in your network right now.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
