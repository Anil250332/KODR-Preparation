import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests, createEmergencyRequestApi } from '../../store/slices/emergencySlice';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { BloodGroup, BloodComponent, UrgencyLevel } from '../../types';
import {
  Radio,
  Search,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HeartHandshake,
  Send,
  PlusCircle,
} from 'lucide-react';

import { addToast } from '../../store/slices/toastSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export const HospitalRaisedRequestsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { requests, isLoading } = useAppSelector((state) => state.emergency);
  const { hospitals } = useAppSelector((state) => state.hospitals);

  const matchedHosp = hospitals.find((h) => h.id === currentUser?.hospitalId);
  const hospitalId = currentUser?.hospitalId || matchedHosp?.id || '6ae5bfa3a41657de36e25a1d';
  const hospitalName = currentUser?.hospitalName || matchedHosp?.name || 'My Hospital';

  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      dispatch(
        addToast({
          type: 'success',
          title: 'Emergency Request Broadcasted',
          message: `${requiredUnits} units of ${bloodGroup} ${component} broadcasted across network.`,
        })
      );

      dispatch(
        addNotification({
          title: '🚨 Emergency Blood Request',
          message: `${requiredUnits} units of ${bloodGroup} (${component}) requested by ${hospitalName}.`,
          type: 'CRITICAL',
          targetRole: 'ALL',
        })
      );

      dispatch(fetchEmergencyRequests());
      setPatientDiagnosis('');
      setClinicalNotes('');
    } catch (err: any) {
      console.error('Failed to create emergency request:', err);
      dispatch(
        addToast({
          type: 'error',
          title: 'Broadcast Failed',
          message: 'Unable to broadcast request. Please try again.',
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only requests raised by this hospital
  const ourRequests = requests.filter(
    (r) => r.requestingHospitalId === hospitalId || r.requestingHospitalName?.includes(hospitalName)
  );

  const filteredRequests = ourRequests.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.requestId.toLowerCase().includes(q) ||
      r.bloodGroup.toLowerCase().includes(q) ||
      (r.acceptedByHospitalName && r.acceptedByHospitalName.toLowerCase().includes(q))
    );
  });

  const acceptedCount = ourRequests.filter((r) => r.status === 'ACCEPTED').length;
  const searchingCount = ourRequests.filter((r) => r.status !== 'ACCEPTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Broadcast Emergency Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Raised by Us (Our Emergency Requests)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Urgent blood requirements created for patients at <strong className="text-slate-800">{hospitalName}</strong>. When another hospital accepts your request, their direct phone and contact info will appear below immediately.
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

        {/* Counter Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Raised</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{ourRequests.length}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Emergency requests sent to network</p>
          </div>
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
            <span className="text-[11px] font-bold uppercase text-[#0d9488]">Accepted & Connected</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{acceptedCount}</p>
            <p className="text-[11px] text-teal-700 mt-0.5">Fulfilled by partner hospitals</p>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <span className="text-[11px] font-bold uppercase text-amber-700">Searching Network</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{searchingCount}</p>
            <p className="text-[11px] text-amber-700 mt-0.5">Awaiting partner hospital acceptance</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, blood group, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
          />
        </div>
      </div>

      {/* List of Raised Requests */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#0d9488] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-500 mt-3">Loading your emergency requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No emergency requests raised yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Need urgent blood components for your patients? Broadcast a live emergency request to all connected hospitals.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast First Request</span>
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => {
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
                          Once another hospital accepts this request, their phone and direct contact details will appear here immediately for direct coordination.
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

      {/* Broadcast Emergency Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Broadcast Emergency Blood Need"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 text-xs">
            <strong>Facility:</strong> {hospitalName}
            <p className="text-[11px] text-rose-600 mt-0.5">
              This will broadcast an urgent emergency alert to all participating hospital blood banks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Required Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-hidden"
              >
                <option value="O-">O- (Universal Donor)</option>
                <option value="O+">O+</option>
                <option value="A-">A-</option>
                <option value="A+">A+</option>
                <option value="B-">B-</option>
                <option value="B+">B+</option>
                <option value="AB-">AB-</option>
                <option value="AB+">AB+</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Required Component</label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-hidden"
              >
                <option value="PRBC">PRBC (Packed Red Blood Cells)</option>
                <option value="FFP">FFP (Fresh Frozen Plasma)</option>
                <option value="Platelets">Platelets (RDP / SDP)</option>
                <option value="Cryoprecipitate">Cryoprecipitate</option>
                <option value="Whole Blood">Whole Blood</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Required Units</label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={requiredUnits}
                onChange={(e) => setRequiredUnits(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-hidden text-rose-600"
              >
                <option value="CRITICAL">Critical (Within 1 hour)</option>
                <option value="HIGH">High (Within 3 hours)</option>
                <option value="MODERATE">Moderate (Within 6 hours)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Clinical Diagnosis / Reason</label>
            <input
              type="text"
              required
              value={patientDiagnosis}
              onChange={(e) => setPatientDiagnosis(e.target.value)}
              placeholder="e.g. Severe postpartum hemorrhage / Trauma casualty"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Additional Instructions (Optional)</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Cross-matching in progress, require immediate courier pickup"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20"
            >
              {isSubmitting ? 'Broadcasting...' : 'Broadcast to Network'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
