import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests } from '../../store/slices/emergencySlice';
import { apiService } from '../../services/apiService';
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
  Send,
  Inbox,
  ArrowRight,
} from 'lucide-react';

import { Modal } from '../../components/common/Modal';
import { createEmergencyRequestApi } from '../../store/slices/emergencySlice';
import { BloodGroup, BloodComponent, UrgencyLevel } from '../../types';

export const HospitalEmergencyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);
  const { hospitals } = useAppSelector((state) => state.hospitals);
  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId = currentUser?.hospitalId || matchedHosp?.id || '6ae5bfa3a41657de36e25a1d';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'My Hospital';

  const [activeTab, setActiveTab] = useState<'INCOMING' | 'ACCEPTED_BY_US' | 'OUR_REQUESTS'>('INCOMING');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New emergency request form state
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [requiredUnits, setRequiredUnits] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [patientDiagnosis, setPatientDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');

  useEffect(() => {
    dispatch(fetchEmergencyRequests());
  }, [dispatch]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(
        createEmergencyRequestApi({
          requestingHospitalId: hospitalId,
          bloodGroup,
          component,
          requiredUnits,
          urgency,
          clinicalNotes: `${patientDiagnosis ? `[Diagnosis: ${patientDiagnosis}] ` : ''}${clinicalNotes}`,
        })
      );
      setIsCreateModalOpen(false);
      setSuccessBanner(`Emergency request for ${requiredUnits} units of ${bloodGroup} ${component} broadcasted to all hospitals!`);
      setActiveTab('OUR_REQUESTS');
      dispatch(fetchEmergencyRequests());
      setPatientDiagnosis('');
      setClinicalNotes('');
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      console.error('Failed to create emergency request:', err);
      alert('Failed to broadcast request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab 1: Incoming requests from other hospitals needing blood
  const incomingRequests = requests.filter(
    (r) => r.requestingHospitalId !== hospitalId && r.status === 'SEARCHING'
  );

  // Tab 2: Requests this hospital accepted to help others
  const acceptedByUs = requests.filter(
    (r) => r.acceptedByHospitalId === hospitalId || (r.status === 'ACCEPTED' && r.acceptedByHospitalName?.includes(hospitalName))
  );

  // Tab 3: Requests created by this hospital
  const ourRequests = requests.filter(
    (r) => r.requestingHospitalId === hospitalId || r.requestingHospitalName?.includes(hospitalName)
  );

  const getDisplayList = () => {
    let list = activeTab === 'INCOMING' ? incomingRequests : activeTab === 'ACCEPTED_BY_US' ? acceptedByUs : ourRequests;
    if (!search) return list;
    return list.filter(
      (r) =>
        r.requestId.toLowerCase().includes(search.toLowerCase()) ||
        r.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
        r.requestingHospitalName.toLowerCase().includes(search.toLowerCase()) ||
        (r.acceptedByHospitalName && r.acceptedByHospitalName.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const currentList = getDisplayList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Hospital Coordination Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Emergency Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track requests received from other hospitals, requests accepted by our team, and emergency requests raised by us.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency</span>
            </button>
            <button
              onClick={() => dispatch(fetchEmergencyRequests())}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {successBanner && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* 3 Interactive Tab Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setActiveTab('INCOMING')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'INCOMING'
                ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Incoming Requests</span>
              <Inbox className={`w-4 h-4 ${activeTab === 'INCOMING' ? 'text-rose-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{incomingRequests.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Active requests needing blood</p>
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
            <p className="text-[11px] text-slate-400 mt-0.5">Helped another hospital</p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OUR_REQUESTS')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeTab === 'OUR_REQUESTS'
                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-500">Raised by Us</span>
              <Send className={`w-4 h-4 ${activeTab === 'OUR_REQUESTS' ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-1">{ourRequests.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Raised for our patients</p>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, hospital, blood group..."
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
            <p className="text-xs font-bold text-slate-500 mt-3">Loading requests...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No requests in this section</p>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'INCOMING'
                ? 'No pending emergency broadcasts from other hospitals right now.'
                : activeTab === 'ACCEPTED_BY_US'
                ? 'This hospital has not accepted any external emergency requests yet.'
                : 'No emergency requests raised by this hospital yet.'}
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
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isAccepted ? 'Accepted & Connected' : 'Searching for Hospital'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Needed: <strong className="text-slate-800">{req.requiredUnits} Units</strong> of {req.component}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Required by: {req.requiredByTime}
                  </span>
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

                  {/* Fulfilling Hospital Status */}
                  <div
                    className={`rounded-2xl p-4 border ${
                      isAccepted ? 'bg-teal-50/80 border-teal-200' : 'bg-slate-50/60 border-dashed border-slate-200'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#0d9488]" />
                      Accepting Hospital Contact Info:
                    </p>

                    {isAccepted ? (
                      <div className="mt-1">
                        <p className="text-sm font-extrabold text-[#0d9488] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {req.acceptedByHospitalName || 'Registered Blood Bank'}
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
                              <span>{req.acceptedByHospitalCity}</span>
                            </p>
                          )}
                          {req.acceptedAt && (
                            <p className="text-[10px] text-[#0d9488] font-bold mt-1">
                              Connected on: {req.acceptedAt}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs font-bold text-amber-700">Awaiting acceptance</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Once another hospital accepts this request, their phone and contact details will appear here immediately for direct coordination.
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

      {/* Broadcast Emergency Request Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast Emergency Blood Request"
        subtitle={`Request urgent blood assistance for ${hospitalName}`}
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Blood Group Required</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Component Needed</label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                {['Whole Blood', 'PRBC', 'Platelets', 'FFP', 'Cryoprecipitate'].map((cmp) => (
                  <option key={cmp} value={cmp}>{cmp}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Required Units</label>
              <input
                type="number"
                min="1"
                max="20"
                value={requiredUnits}
                onChange={(e) => setRequiredUnits(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="CRITICAL">CRITICAL (Immediate)</option>
                <option value="HIGH">HIGH (Within 2 Hours)</option>
                <option value="NORMAL">NORMAL (Same Day)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Patient Diagnosis / Condition</label>
            <input
              type="text"
              placeholder="e.g. Acute Trauma, Hemorrhage, Emergency Surgery"
              value={patientDiagnosis}
              onChange={(e) => setPatientDiagnosis(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Additional Clinical Notes</label>
            <input
              type="text"
              placeholder="Cross-matching notes, special requirements"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 cursor-pointer"
            >
              {isSubmitting ? 'Broadcasting...' : 'Broadcast Emergency'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
