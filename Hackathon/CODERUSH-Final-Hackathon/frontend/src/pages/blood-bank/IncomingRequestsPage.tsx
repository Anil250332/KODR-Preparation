import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { apiService } from '../../services/apiService';
import { EmergencyRequest } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  Inbox,
  Radio,
  Building2,
  Clock,
  Droplet,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
} from 'lucide-react';

export const IncomingRequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId =
    currentUser?.hospitalId && currentUser.hospitalId.length === 24
      ? currentUser.hospitalId
      : matchedHosp?.id || '6ae5bfa3a41657de36e25a1e';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'Blood Centre';

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'ACCEPTED_BY_US'>('OPEN');

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  // Open emergency requests from other hospitals
  const openNetworkRequests = requests.filter(
    (r) => r.requestingHospitalId !== hospitalId && r.status === 'SEARCHING'
  );

  // Requests this officer's hospital has accepted
  const acceptedByUs = requests.filter(
    (r) => r.acceptedByHospitalId === hospitalId || (r.status === 'ACCEPTED' && r.acceptedByHospitalName?.includes(hospitalName))
  );

  const handleAcceptRequest = async (req: EmergencyRequest) => {
    if (!window.confirm(`Accept emergency request for ${req.requiredUnits} units of ${req.bloodGroup} from ${req.requestingHospitalName}?`)) {
      return;
    }

    setAcceptingId(req.id);
    try {
      await apiService.acceptEmergencyRequest(req.id, hospitalId);
      setSuccessMsg(`Emergency request ${req.requestId} accepted! You are now connected with ${req.requestingHospitalName}.`);
      dispatch(fetchEmergencyRequests());
    } catch (err: any) {
      console.error('Failed to accept request:', err);
      alert(err.message || 'Failed to accept request');
    } finally {
      setAcceptingId(null);
    }
  };

  const currentList = activeTab === 'OPEN' ? openNetworkRequests : acceptedByUs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Inter-Hospital Emergency Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Network Emergency Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active requests from other hospitals in the network needing urgent blood support. If your center has the stock, accept the request to connect directly.
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

        {successMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 2 Tabs */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('OPEN')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'OPEN'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Incoming Emergency Alerts ({openNetworkRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('ACCEPTED_BY_US')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ACCEPTED_BY_US'
                ? 'bg-[#0d9488] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Accepted by Us ({acceptedByUs.length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Scanning network for emergency broadcasts...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No emergency requests in this view</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'OPEN'
                ? 'All hospitals in the network currently have sufficient blood inventory.'
                : 'Your hospital has not accepted any external emergency requests yet.'}
            </p>
          </div>
        ) : (
          currentList.map((req) => {
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
                              : 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                          }`}
                        >
                          {isAccepted ? 'Accepted by You' : 'Urgent Need'}
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
                      Needed by: {req.requiredByTime}
                    </span>

                    {!isAccepted && (
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        disabled={acceptingId === req.id}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <HeartHandshake className="w-4 h-4" />
                        <span>{acceptingId === req.id ? 'Connecting...' : 'Accept Request'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Hospital Details */}
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
                        <strong className="text-slate-700">Clinical Reason:</strong> {req.clinicalNotes}
                      </p>
                    )}
                  </div>

                  {/* Connected Status or Quick Direct Contact */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    {isAccepted ? (
                      <div>
                        <p className="text-[11px] font-bold text-[#0d9488] uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Connected! Coordinate Blood Handover:
                        </p>
                        <p className="text-xs text-slate-600 mt-2">
                          Your hospital has accepted this request. Please contact <strong>{req.requestingHospitalName}</strong> to coordinate direct blood transfer.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Connected timestamp: {req.acceptedAt || 'Just now'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Platform Role:</p>
                        <p className="text-xs text-slate-600 mt-1">
                          PulseRelay connects hospitals in emergency need. Once you click <strong>"Accept Request"</strong>, both hospitals receive mutual contact details to arrange immediate direct handover.
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
