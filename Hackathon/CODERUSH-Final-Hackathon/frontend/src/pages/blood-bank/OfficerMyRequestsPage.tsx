import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchEmergencyRequests, createEmergencyRequestApi } from '../../store/slices/emergencySlice';
import { BloodGroup, BloodComponent, UrgencyLevel, EmergencyRequest } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  Send,
  PlusCircle,
  Radio,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
  HeartHandshake,
} from 'lucide-react';

export const OfficerMyRequestsPage: React.FC = () => {
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

  // Form State
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [requiredUnits, setRequiredUnits] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('CRITICAL');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [patientDiagnosis, setPatientDiagnosis] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

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
      setSuccessBanner(`Emergency broadcast for ${requiredUnits} units of ${bloodGroup} ${component} sent successfully!`);
      setClinicalNotes('');
      setPatientDiagnosis('');
      dispatch(fetchEmergencyRequests());
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      console.error('Failed to create emergency request', err);
      alert('Failed to broadcast request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests belonging to this officer's hospital
  const myHospitalRequests = requests.filter(
    (r) => r.requestingHospitalId === hospitalId || r.requestingHospitalName?.includes(hospitalName)
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Broadcast Emergency Need</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Request & Hospital Connections
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Broadcast urgent blood requirements for {hospitalName} to all hospitals in the network. When any hospital accepts your request, their direct contact details appear here immediately.
            </p>
          </div>

          <button
            onClick={() => dispatch(fetchEmergencyRequests())}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Check Responses</span>
          </button>
        </div>

        {successBanner && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}
      </div>

      {/* SECTION 1: Create Request Form */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2.5 pb-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Broadcast New Emergency Request</h2>
            <p className="text-xs text-slate-400">Fill patient requirements to broadcast to all participating hospital blood banks</p>
          </div>
        </div>

        <form onSubmit={handleCreateRequest} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Required Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((grp) => (
                  <option key={grp} value={grp}>{grp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Component</label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value as BloodComponent)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
              >
                {['Whole Blood', 'PRBC', 'Platelets', 'FFP', 'Cryoprecipitate'].map((cmp) => (
                  <option key={cmp} value={cmp}>{cmp}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Required Units</label>
              <input
                type="number"
                min="1"
                max="20"
                value={requiredUnits}
                onChange={(e) => setRequiredUnits(Number(e.target.value))}
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
              >
                <option value="CRITICAL">CRITICAL (Immediate)</option>
                <option value="HIGH">HIGH (Within 2 Hours)</option>
                <option value="NORMAL">NORMAL (Same Day)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Patient Diagnosis / Condition</label>
              <input
                type="text"
                placeholder="e.g. Acute Trauma, Hemorrhage, ICU Admission"
                value={patientDiagnosis}
                onChange={(e) => setPatientDiagnosis(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">Additional Clinical Notes</label>
              <input
                type="text"
                placeholder="Any special storage, compatibility or urgent notes"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0d9488]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-rose-600/25 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Broadcasting to Network...' : 'Broadcast Emergency Request'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Our Hospital's Requests List & Acceptance Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Requests Broadcasted by Our Hospital ({myHospitalRequests.length})
          </h2>
          <span className="text-xs text-slate-400 font-medium">Real-time fulfillment tracking</span>
        </div>

        {myHospitalRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No requests broadcasted yet</p>
            <p className="text-xs text-slate-400 mt-1">Use the form above to broadcast emergency blood requests.</p>
          </div>
        ) : (
          myHospitalRequests.map((req) => {
            const isAccepted = req.status === 'ACCEPTED';
            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm transition-all ${
                  isAccepted ? 'border-teal-300 bg-teal-50/15 ring-2 ring-teal-500/10' : 'border-slate-100'
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
                              : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                          }`}
                        >
                          {isAccepted ? 'Request Accepted!' : 'Awaiting Hospital Acceptance'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Needed: <strong className="text-slate-800">{req.requiredUnits} Units</strong> of {req.component} • Broadcasted {new Date(req.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Required by: {req.requiredByTime}
                  </span>
                </div>

                {/* Acceptance and Contact Details */}
                <div className="mt-4 pt-2">
                  {isAccepted ? (
                    <div className="bg-teal-50/80 rounded-2xl p-5 border border-teal-200">
                      <div className="flex items-center gap-2 text-[#0d9488]">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <h3 className="font-extrabold text-sm text-slate-900">
                          {req.acceptedByHospitalName || 'Registered Blood Centre'} has ACCEPTED your request!
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 pl-7">
                        Contact this hospital immediately to arrange handover & len-den:
                      </p>

                      <div className="mt-3 pl-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-xl border border-teal-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Hospital Phone</p>
                          <p className="text-xs font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#0d9488]" />
                            {req.acceptedByHospitalPhone || '+91 98260 22201'}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-teal-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Hospital Email</p>
                          <p className="text-xs font-black text-slate-900 mt-0.5 flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-[#0d9488]" />
                            {req.acceptedByHospitalEmail || 'bloodcentre@apollo.org'}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-teal-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                          <p className="text-xs font-black text-slate-900 mt-0.5 flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#0d9488]" />
                            {req.acceptedByHospitalCity || 'Indore'}
                          </p>
                        </div>
                      </div>

                      {req.acceptedAt && (
                        <p className="text-[10px] text-[#0d9488] font-bold mt-3 pl-7">
                          Accepted on: {req.acceptedAt}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 flex items-center gap-3">
                      <Radio className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                      <p className="text-xs text-amber-800 font-medium">
                        Broadcast active across all connected hospitals. As soon as another hospital accepts this request, their phone and contact info will appear here so you can coordinate directly.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
