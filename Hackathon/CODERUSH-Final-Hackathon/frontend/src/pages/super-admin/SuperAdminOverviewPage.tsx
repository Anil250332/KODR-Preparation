import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHospitals } from '../../store/slices/hospitalSlice';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Building2,
  Droplet,
  Radio,
  Truck,
  Clock,
  ArrowUpRight,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuperAdminOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const { requests } = useAppSelector((state) => state.emergency);
  const { items } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchHospitals());
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  const totalHospitals = hospitals.length;
  const verifiedHospitals = hospitals.filter((h) => h.verified).length;
  const pendingApprovals = hospitals.filter((h) => h.status === 'PENDING_VERIFICATION').length;
  const activeEmergencies = requests.filter((r) => r.status === 'SEARCHING').length;
  const connectedRequests = requests.filter((r) => r.status === 'ACCEPTED').length;
  const totalUnitsInGrid = items.reduce((acc, curr) => acc + curr.availableUnits, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            National inter-hospital emergency coordination & blood stock overview
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/super-admin/hospitals')}
            className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Hospitals</span>
          </button>
          <button
            onClick={() => navigate('/super-admin/emergency-requests')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Radio className="w-4 h-4 text-rose-500" />
            <span>Emergency Requests</span>
          </button>
        </div>
      </div>

      {/* 4 Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Participating Hospitals"
          value={totalHospitals}
          subtitle={`${verifiedHospitals} verified centres`}
          icon={Building2}
          color="teal"
        />
        <StatCard
          title="Active Emergencies"
          value={activeEmergencies}
          subtitle="Awaiting hospital acceptance"
          icon={Radio}
          color="rose"
        />
        <StatCard
          title="Connected Hospitals"
          value={connectedRequests}
          subtitle="Emergencies matched & accepted"
          icon={Droplet}
          color="emerald"
        />
        <StatCard
          title="Available Blood Units"
          value={totalUnitsInGrid}
          subtitle="Total verified grid stock"
          icon={Droplet}
          color="blue"
        />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Emergencies (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Active Regional Emergencies</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live requests seeking or allocating units</p>
            </div>
            <button
              onClick={() => navigate('/super-admin/emergency-monitoring')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.slice(0, 3).map((req) => (
              <div key={req.id} className="py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center border border-rose-100">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {req.requestingHospitalName} • {req.component} ({req.allocatedUnits}/{req.requiredUnits} Units)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {req.requiredByTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hospital Approvals (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Facility Approvals</h2>
              <p className="text-xs text-slate-400 mt-0.5">Verification & compliance status</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {pendingApprovals} Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {hospitals.map((hosp) => (
              <div key={hosp.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{hosp.name}</p>
                    <StatusBadge status={hosp.status} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {hosp.city} • Lic: {hosp.licenseNumber}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/super-admin/hospitals')}
                  className="shrink-0 px-3 py-1 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-[#0d9488] hover:text-white text-slate-600 transition-colors"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
