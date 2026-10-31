import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { StatusBadge } from '../../components/common/Badge';
import {
  Radio,
  Search,
  Building2,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
} from 'lucide-react';

export const AdminEmergencyRequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, isLoading } = useAppSelector((state) => state.emergency);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SEARCHING' | 'ACCEPTED'>('ALL');

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestingHospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.acceptedByHospitalName && req.acceptedByHospitalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      req.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACCEPTED'
        ? req.status === 'ACCEPTED'
        : req.status === 'SEARCHING';

    return matchesSearch && matchesStatus;
  });

  const totalSearching = requests.filter((r) => r.status === 'SEARCHING').length;
  const totalAccepted = requests.filter((r) => r.status === 'ACCEPTED').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Inter-Hospital Emergency Network Oversight</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Emergency Requests & Connections
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live broadcast log of all hospital emergency blood requests and inter-hospital fulfillment connections.
            </p>
          </div>

          <button
            onClick={() => dispatch(fetchEmergencyRequests())}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* 2 Big Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Total Requests Broadcasted</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{requests.length}</p>
          </div>
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100">
            <p className="text-[11px] font-bold text-rose-600 uppercase">Awaiting Help (Searching)</p>
            <p className="text-xl font-black text-rose-700 mt-0.5">{totalSearching}</p>
          </div>
          <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
            <p className="text-[11px] font-bold text-[#0d9488] uppercase">Successfully Connected & Accepted</p>
            <p className="text-xl font-black text-[#0d9488] mt-0.5">{totalAccepted}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by hospital, ID, or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#0d9488] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setStatusFilter('SEARCHING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'SEARCHING'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Open ({totalSearching})
          </button>
          <button
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'ACCEPTED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Accepted ({totalAccepted})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Loading emergency coordination feed...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No emergency requests found</p>
            <p className="text-xs text-slate-400 mt-1">No emergency broadcasts match your current filter.</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isAccepted = req.status === 'ACCEPTED';
            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border transition-all p-6 shadow-sm hover:shadow-md ${
                  isAccepted ? 'border-teal-200 bg-teal-50/15' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center border border-rose-100 shrink-0">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-extrabold text-sm text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isAccepted
                              ? 'bg-teal-100 text-[#0d9488] border border-teal-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          }`}
                        >
                          {isAccepted ? 'Connected & Accepted' : 'Searching for Hospital'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Needed: <strong className="text-slate-800">{req.requiredUnits} Units</strong> of {req.component} • Required by: {req.requiredByTime}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Broadcasted: {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Coordination Breakdown: Requesting Hospital ➔ Accepting Hospital */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
                  {/* Left: Requesting Hospital Details */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-rose-500" />
                      Requesting Hospital:
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">
                      {req.requestingHospitalName}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.requestingHospitalCity || 'Indore'}
                    </p>
                    {req.clinicalNotes && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-white p-2 rounded-xl border border-slate-200/60">
                        <strong className="text-slate-700">Notes:</strong> {req.clinicalNotes}
                      </p>
                    )}
                  </div>

                  {/* Right: Accepting Hospital Details */}
                  <div
                    className={`rounded-2xl p-4 border ${
                      isAccepted
                        ? 'bg-teal-50/80 border-teal-200'
                        : 'bg-slate-50/60 border-dashed border-slate-200'
                    }`}
                  >
                    <p className="text-[11px] font-bold uppercase flex items-center gap-1.5 text-slate-500">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#0d9488]" />
                      Fulfilling / Accepting Hospital:
                    </p>

                    {isAccepted ? (
                      <div className="mt-1">
                        <p className="text-sm font-extrabold text-[#0d9488] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {req.acceptedByHospitalName || 'Registered Blood Centre'}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          {req.acceptedByHospitalPhone && (
                            <p className="flex items-center gap-2 font-semibold">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.acceptedByHospitalPhone}</span>
                            </p>
                          )}
                          {req.acceptedByHospitalEmail && (
                            <p className="flex items-center gap-2 font-medium">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.acceptedByHospitalEmail}</span>
                            </p>
                          )}
                          {req.acceptedByHospitalCity && (
                            <p className="flex items-center gap-2 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.acceptedByHospitalCity} {req.acceptedByHospitalAddress ? `• ${req.acceptedByHospitalAddress}` : ''}</span>
                            </p>
                          )}
                          {req.acceptedAt && (
                            <p className="text-[10px] text-[#0d9488] font-bold mt-1">
                              Accepted on: {req.acceptedAt}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs font-bold text-amber-700">Waiting for a hospital to accept</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Alert broadcasted across all participating hospitals.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
