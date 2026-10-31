import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchHospitalInventory } from '../../store/slices/inventorySlice';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Droplet,
  BookmarkCheck,
  Inbox,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Clock,
  Building2,
} from 'lucide-react';

export const BloodBankOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { items, isLoading } = useAppSelector((state) => state.inventory);
  const { requests } = useAppSelector((state) => state.emergency);
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId = currentUser?.hospitalId || matchedHosp?.id || '6ae5bfa3a41657de36e25a1e';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'Blood Centre';

  useEffect(() => {
    if (hospitalId) {
      dispatch(fetchHospitalInventory(hospitalId));
    }
    dispatch(fetchEmergencyRequests());
  }, [dispatch, hospitalId]);

  const myInventory = items.length > 0 && items.some((i) => i.hospitalId === hospitalId)
    ? items.filter((i) => i.hospitalId === hospitalId)
    : items;

  const totalAvailable = myInventory.reduce((acc, curr) => acc + curr.availableUnits, 0);
  const totalReserved = myInventory.reduce((acc, curr) => acc + curr.reservedUnits, 0);

  // Incoming emergencies searching for units
  const incomingEmergencies = requests.filter(
    (r) => r.status === 'SEARCHING' || r.status === 'OFFERS_RECEIVED' || r.status === 'PARTIALLY_ALLOCATED'
  );

  // Low stock critical alerts
  const lowStockItems = myInventory.filter((i) => i.availableUnits < 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blood Bank Operations</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Component inventory, incoming emergency broadcasts, and unit reservations for <strong className="text-slate-800">{hospitalName}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/blood-bank/inventory')}
            className="px-5 py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Inventory</span>
          </button>
          <button
            onClick={() => navigate('/blood-bank/incoming-requests')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-2xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Inbox className="w-4 h-4 text-rose-500" />
            <span>Incoming ({incomingEmergencies.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Minimal Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Ready Blood Units"
          value={totalAvailable}
          subtitle="Certified units in cold storage"
          icon={Droplet}
          color="teal"
        />
        <StatCard
          title="Reserved Units"
          value={totalReserved}
          subtitle="Locked for accepted hospital offers"
          icon={BookmarkCheck}
          color="amber"
        />
        <StatCard
          title="Incoming Requests"
          value={incomingEmergencies.length}
          subtitle="Urgent broadcasts in network"
          icon={Inbox}
          color="rose"
        />
        <StatCard
          title="Critical Shortage"
          value={lowStockItems.length}
          subtitle="Groups below threshold"
          icon={AlertTriangle}
          color="blue"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incoming Emergency Broadcasts (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Incoming Urgent Broadcasts</h2>
              <p className="text-xs text-slate-400 mt-0.5">Hospitals actively seeking blood units</p>
            </div>
            <button
              onClick={() => navigate('/blood-bank/network-requests')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1 cursor-pointer"
            >
              <span>View & Accept</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-3.5">
            {incomingEmergencies.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs flex items-center justify-center border border-rose-100">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                      </div>
                      <p className="text-xs text-slate-800 font-bold mt-0.5">
                        {req.requiredUnits} Units {req.component}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {req.requiredByTime}
                  </span>
                </div>

                <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {req.requestingHospitalName} ({req.requestingHospitalCity})
                  </span>
                  <button
                    onClick={() => navigate('/blood-bank/network-requests')}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Accept & Connect →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Blood Inventory Group Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Stock Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">On-site stock with storage telemetry</p>
            </div>
            <button
              onClick={() => navigate('/blood-bank/inventory')}
              className="text-xs font-bold text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {myInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 font-black text-xs flex items-center justify-center">
                    {item.bloodGroup}
                  </span>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{item.component}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Temp: {item.storageTemp}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-sm text-slate-900">{item.availableUnits} Bags</span>
                  {item.reservedUnits > 0 && (
                    <span className="text-[10px] text-amber-600 block font-semibold">
                      ({item.reservedUnits} reserved)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
