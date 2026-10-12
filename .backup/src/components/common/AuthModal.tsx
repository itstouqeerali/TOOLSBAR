import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User as UserIcon, ArrowRight, 
  CheckCircle2, AlertCircle, Loader2, Eye, EyeOff
} from 'lucide-react';
import { ToolsbarLogo } from './ToolsbarLogo';
import { useAuth } from '../../context/AuthContext';

type AuthView = 'login' | 'register' | 'forgot_password';

interface AuthModalProps {
  isOpen: boolean;
  initialView?: AuthView;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialView = 'register',
  onClose,
  onSuccess,
}) => {
  const { signIn, signUp, signInWithGoogle, sendPasswordReset } = useAuth();

  const [view, setView] = useState<AuthView>(initialView);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');

  // Independent password visibility states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync initial view when opened
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setErrorMsg(null);
      setSuccessMsg(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen, initialView]);

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

  const mapFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please verify your credentials and try again.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed attempts. Try again later or reset your password.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Google Sign-In was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Google Sign-In popup was blocked by your browser. Please allow popups for Toolsbar.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection and try again.';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is currently disabled in your Firebase console. Please ensure Email/Password and Google sign-in providers are enabled in Firebase Authentication.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized in Firebase Authentication. Please add this domain to Authorized Domains in Firebase Console.';
      case 'auth/user-disabled':
        return 'This user account has been disabled by an administrator.';
      case 'auth/requires-recent-login':
        return 'This action requires recent authentication. Please sign in again and retry.';
      default:
        return err?.message || 'An authentication error occurred. Please try again.';
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      setSuccessMsg('Signed in with Google successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg(mapFirebaseError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (view === 'register') {
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match. Please verify and retype.');
          setLoading(false);
          return;
        }

        await signUp(email, password, displayName);
        setSuccessMsg('Account created successfully! Verification email has been sent.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      } else if (view === 'login') {
        if (!password) {
          setErrorMsg('Please enter your password.');
          setLoading(false);
          return;
        }

        await signIn(email, password);
        setSuccessMsg('Signed in successfully.');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      } else if (view === 'forgot_password') {
        await sendPasswordReset(email);
        setSuccessMsg('Password reset instructions have been sent to your email address.');
      }
    } catch (err: any) {
      setErrorMsg(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 text-left cursor-default animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          id="auth-close-btn"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-white shadow-sm p-2">
            <ToolsbarLogo className="w-full h-full" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Toolsbar Cloud
            </span>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              {view === 'register' && 'Create Free Account'}
              {view === 'login' && 'Sign in to Toolsbar'}
              {view === 'forgot_password' && 'Reset Password'}
            </h3>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Google Sign-In Button (Login & Register views) */}
        {view !== 'forgot_password' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              id="google-auth-btn"
              className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                or with email
              </span>
              <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Full Name <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {view !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300">
                  Password
                </label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setView('forgot_password'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {view === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  id="toggle-confirm-password-visibility-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed pt-1">
            🔒 <strong>Browser-first privacy:</strong> All tool operations (PDFs, images, data conversions) are processed 100% locally in your browser.
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || googleLoading}
              id="auth-submit-btn"
              className="w-full py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {view === 'register' && <span>Create Account</span>}
                  {view === 'login' && <span>Sign In</span>}
                  {view === 'forgot_password' && <span>Send Reset Link</span>}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* View Switcher Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-center text-xs text-slate-600 dark:text-neutral-400">
          {view === 'register' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setView('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Sign In
              </button>
            </p>
          )}

          {view === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setView('register'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          )}

          {view === 'forgot_password' && (
            <p>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => { setView('login'); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer ml-1"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

