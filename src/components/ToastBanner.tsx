import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastMessage } from '../types/character';

interface ToastBannerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2 px-2 sm:px-0"
    >
      {toasts.map((toast) => {
        const icon =
          toast.tone === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
          ) : toast.tone === 'warning' ? (
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" aria-hidden="true" />
          ) : (
            <Info className="h-4 w-4 text-[#d4a853] shrink-0" aria-hidden="true" />
          );

        const borderClass =
          toast.tone === 'success'
            ? 'border-emerald-500/45'
            : toast.tone === 'warning'
              ? 'border-amber-500/50'
              : 'border-[#d4a853]/45';

        return (
          <div
            key={toast.id}
            role="status"
            className={`flex items-center justify-between gap-3 rounded-lg border ${borderClass} bg-[#161124]/95 px-4 py-3 text-sm text-[#f4efe6] shadow-xl backdrop-blur-md`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-[#9b92a8] hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
