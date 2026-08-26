import React, { useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { ToolsbarLogo } from './ToolsbarLogo';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  // Global key listener for ESC to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="register-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        id="register-modal-container"
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 text-left cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          id="register-close-btn"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-white shadow-sm p-2">
            <ToolsbarLogo className="w-full h-full" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Toolsbar Account
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Accounts Coming Soon
            </h3>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3 text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
          <p>
            Accounts are coming soon. Soon you'll be able to save your tools, calculations, and work.
          </p>
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-2 text-xs text-slate-600 dark:text-neutral-400">
            <div className="flex items-center gap-2 text-slate-800 dark:text-neutral-200 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Future account features:</span>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-600 dark:text-neutral-400">
              <li>Save favorite tools & calculation history</li>
              <li>Sync custom workspaces across devices</li>
              <li>Export work logs with zero latency</li>
            </ul>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            id="register-got-it-btn"
            className="w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer text-center"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
