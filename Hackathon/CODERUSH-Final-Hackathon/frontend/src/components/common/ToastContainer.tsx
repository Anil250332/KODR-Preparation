import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { removeToast, ToastItem } from '../../store/slices/toastSlice';

const ToastMessageItem: React.FC<{ toast: ToastItem }> = ({ toast }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [dispatch, toast.id, toast.duration]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-200 bg-white/95';
      case 'error':
        return 'border-rose-200 bg-white/95';
      case 'warning':
        return 'border-amber-200 bg-white/95';
      default:
        return 'border-teal-200 bg-white/95';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.9, transition: { duration: 0.15 } }}
      className={`pointer-events-auto flex items-start gap-3 w-80 sm:w-96 p-4 rounded-2xl shadow-xl backdrop-blur-md border ${getBorderColor()} transition-all`}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-extrabold text-slate-900 leading-snug">{toast.title}</h4>
        {toast.message && (
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed wrap-break-word font-medium">
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useAppSelector((state) => state.toast);

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-50 flex flex-col items-end space-y-2 pointer-events-none max-w-full px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastMessageItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
