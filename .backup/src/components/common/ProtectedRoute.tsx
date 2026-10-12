import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2, ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  onNavigate,
  onOpenAuth,
}) => {
  const { user, userProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="pt-40 pb-24 max-w-md mx-auto px-4 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono tracking-wide">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-6" id="auth-required-view">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Authentication Required
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
            {requireAdmin 
              ? 'You must be signed in with administrator credentials to access this system.'
              : 'You must be signed in to access your profile, favorites, and personalization preferences.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Sign In to Continue
          </button>
          <button
            onClick={() => onNavigate('')}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs transition-all cursor-pointer border border-slate-200 dark:border-white/10 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="pt-36 pb-24 max-w-md mx-auto px-4 text-center space-y-6" id="forbidden-admin-view">
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center mx-auto text-red-600 dark:text-red-400 shadow-xl shadow-red-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
            403 Forbidden
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
            Your account (<span className="font-mono font-semibold text-slate-900 dark:text-white">{user.email}</span>) does not have administrator permissions (Role: <span className="font-mono uppercase font-bold text-amber-500">{userProfile?.role || 'user'}</span>).
          </p>
        </div>
        <button
          onClick={() => onNavigate('')}
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
