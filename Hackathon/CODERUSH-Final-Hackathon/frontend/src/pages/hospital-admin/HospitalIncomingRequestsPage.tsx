import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { apiService } from '../../services/apiService';
import { EmergencyRequest } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  Inbox,
  Radio,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  Search,
  Check,
} from 'lucide-react';

export const HospitalIncomingRequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId = currentUser?.hospitalId || matchedHosp?.id || '6ae5bfa3a41657de36e25a1d';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'My Hospital';

  const [activeTab, setActiveTab] = useState<'OPEN' | 'ACCEPTED_BY_US'>('OPEN');
  const [search, setSearch] = useState('');
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  // Tab 1: Open incoming requests from OTHER hospitals seeking blood
  const incomingRequests = requests.filter(
    (r) => r.requestingHospitalId !== hospitalId && r.status === 'SEARCHING'
  );

  // Tab 2: Requests this hospital stepped up to fulfill
  const acceptedByUs = requests.filter(
    (r) => r.acceptedByHospitalId === hospitalId || (r.status === 'ACCEPTED' && r.acceptedByHospitalName?.includes(hospitalName))
  );

  const handleAcceptRequest = async (req: EmergencyRequest) => {
    if (
      !window.confirm(
        `Are you sure you want to accept the emergency request for ${req.requiredUnits} units of ${req.bloodGroup} ${req.component} from ${req.requestingHospitalName}?`
      )
    ) {
      return;
    }

    setAcceptingId(req.id);
    try {
      await apiService.acceptEmergencyRequest(req.id, hospitalId);
      setSuccessBanner(
        `Emergency request ${req.requestId} accepted! You are now directly connected with ${req.requestingHospitalName}.`
      );
      dispatch(fetchEmergencyRequests());
      setActiveTab('ACCEPTED_BY_US');
      setTimeout(() => setSuccessBanner(null), 6000);
    } catch (err: any) {
      console.error('Failed to accept request:', err);
      alert(err.message || 'Failed to accept request. Please try again.');
    } finally {
      setAcceptingId(null);
    }
  };

  const currentList = activeTab === 'OPEN' ? incomingRequests : acceptedByUs;

  const filteredList = currentList.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.requestId.toLowerCase().includes(q) ||
      r.bloodGroup.toLowerCase().includes(q) ||
      r.requestingHospitalName.toLowerCase().includes(q) ||
      (r.requestingHospitalCity && r.requestingHospitalCity.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Inbox className="w-3.5 h-3.5 animate-pulse" />
              <span>Network Blood Influx</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Incoming Network Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live emergency broadcasts from other hospital centers needing blood components. If <strong className="text-slate-800">{hospitalName}</strong> has available stock, click <em>Accept Request</em> to establish immediate direct contact.
            </p>
          </div>

          <button
            onClick={() => dispatch(fetchEmergencyRequests())}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Alerts</span>
          </button>
        </div>

        {successBanner && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* 2 Tab Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('OPEN')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'OPEN'
                ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Open Network Needs</span>
              <Inbox className={`w-4 h-4 ${activeTab === 'OPEN' ? 'text-rose-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{incomingRequests.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Hospitals currently seeking blood units</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACCEPTED_BY_US')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'ACCEPTED_BY_US'
                ? 'bg-teal-50 border-teal-200 ring-2 ring-[#0d9488]/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Accepted by Us</span>
              <CheckCircle2 className={`w-4 h-4 ${activeTab === 'ACCEPTED_BY_US' ? 'text-[#0d9488]' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{acceptedByUs.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Requests our team has stepped up to fulfill</p>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospital name, ID, or blood group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>
      </div>

      {/* List of Requests */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Loading incoming requests...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No requests in this section</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'OPEN'
                ? 'No external hospitals are currently broadcasting emergency requests.'
                : 'Your hospital has not accepted any external emergency requests yet.'}
            </p>
          </div>
        ) : (
          filteredList.map((req) => {
            const isAccepted = req.status === 'ACCEPTED';
            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border transition-all p-6 shadow-sm hover:shadow-md ${
                  isAccepted ? 'border-teal-200 bg-teal-50/10' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <span className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center border border-rose-100 shrink-0">
                      {req.bloodGroup}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-sm text-slate-900">{req.requestId}</span>
                        <StatusBadge status={req.urgency} />
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isAccepted
                              ? 'bg-teal-100 text-[#0d9488] border border-teal-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isAccepted ? 'Accepted by Our Hospital' : 'Seeking Units'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Needed: <strong className="text-slate-800">{req.requiredUnits} Units</strong> of {req.component}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Required by: {req.requiredByTime}
                    </span>

                    {!isAccepted && (
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        disabled={acceptingId === req.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{acceptingId === req.id ? 'Accepting...' : 'Accept Request'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Requesting Hospital:</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-1">{req.requestingHospitalName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.requestingHospitalCity || 'Indore'}
                    </p>
                    {req.clinicalNotes && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-white p-2 rounded-xl border border-slate-200/60">
                        <strong className="text-slate-700">Clinical Need:</strong> {req.clinicalNotes}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#0d9488]" />
                      Direct Hospital Connection:
                    </p>
                    {isAccepted ? (
                      <div className="mt-2 text-xs text-slate-700 space-y-1">
                        <p className="font-extrabold text-[#0d9488] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Direct Connection Established</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Our hospital ({hospitalName}) has agreed to supply {req.requiredUnits} units of {req.bloodGroup} {req.component}.
                        </p>
                        {req.acceptedAt && (
                          <p className="text-[10px] text-slate-400 font-semibold">Accepted on: {req.acceptedAt}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-slate-500">
                        <p className="leading-relaxed">
                          Click <strong>Accept Request</strong> to promise blood units to this hospital. Both centers will be immediately paired for direct coordination and courier dispatch.
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
