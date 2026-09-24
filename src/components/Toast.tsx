import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-medium max-w-sm animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700"
        >
          <span className="material-symbols-outlined text-[18px] text-emerald-400 mt-0.5 flex-shrink-0">
            check_circle
          </span>
          <div className="flex-1">
            <p className="font-semibold text-white">{toast.title}</p>
            {toast.description && (
              <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
