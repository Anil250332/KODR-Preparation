import React, { useEffect } from 'react';
import { EmergencyRequest } from '../../types';
import { StatusBadge } from './Badge';
import {
  HeartHandshake,
  Building2,
  Clock,
  MapPin,
  Check,
  X,
  AlertTriangle,
  ShieldCheck,
  Droplet,
} from 'lucide-react';

interface AcceptConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  request: EmergencyRequest | null;
  isSubmitting?: boolean;
}

export const AcceptConfirmationModal: React.FC<AcceptConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  request,
  isSubmitting = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto transform transition-all duration-300 scale-100">
        {/* Top Header with Emergency Pulse Badge */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-teal-50/60 to-emerald-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0d9488]/15 text-[#0d9488] flex items-center justify-center shrink-0 shadow-sm border border-teal-200/50">
              <HeartHandshake className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-[#0d9488]">
                  Inter-Hospital Fulfillment
                </span>
                <StatusBadge status={request.urgency} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 tracking-tight">
                Accept Emergency Request
              </h3>
            </div>
          </div>

          <button
            onClick={() => !isSubmitting && onClose()}
            disabled={isSubmitting}
            className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Main Request Specimen Highlight Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-13 h-13 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-black text-base flex flex-col items-center justify-center shrink-0 shadow-xs">
                <span>{request.bloodGroup}</span>
                <span className="text-[9px] font-bold text-rose-500 uppercase tracking-tighter -mt-1">
                  {request.component}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-extrabold text-slate-800">
                    {request.requestId}
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {request.requiredUnits} Units Needed
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Component: <strong className="text-slate-700">{request.component}</strong>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Required By</span>
              <span className="text-xs font-extrabold text-rose-600 flex items-center gap-1 justify-end mt-0.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                {request.requiredByTime}
              </span>
            </div>
          </div>

          {/* Hospital Info & Clinical Need */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                Requesting Hospital:
              </span>
              <span className="font-extrabold text-slate-900">{request.requestingHospitalName}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                Location:
              </span>
              <span className="font-semibold text-slate-700">
                {request.requestingHospitalCity || 'Madhya Pradesh'}
              </span>
            </div>

            {request.clinicalNotes && (
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Clinical Diagnosis / Notes
                </span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-medium italic">
                  "{request.clinicalNotes}"
                </p>
              </div>
            )}
          </div>

          {/* Commitment Notice */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/70 flex items-start space-x-2.5 text-xs text-teal-900">
            <ShieldCheck className="w-4 h-4 text-[#0d9488] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              By confirming, your center agrees to allocate and fulfill <strong>{request.requiredUnits} units</strong> of <strong>{request.bloodGroup} {request.component}</strong>. Both hospital coordination desks will be instantly connected with direct phone and dispatch contact info.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-lg shadow-teal-700/25 transition-all flex items-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Confirming Connection...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirm & Accept Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
