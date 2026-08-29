import React, { useState, useEffect } from 'react';
import {
  User, Mail, ShieldCheck, Lock, Star, Clock, 
  Trash2, RefreshCw, CheckCircle2, AlertCircle,
  ExternalLink, ArrowRight, Sparkles, Shield, KeyRound,
  Check, Copy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TOOLS } from '../../data/tools';
import { Tool } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { ToolCard } from '../common/ToolCard';

interface AccountViewProps {
  initialTab?: 'profile' | 'favorites' | 'recent';
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  initialTab = 'profile',
  onNavigate,
  onOpenAuth,
}) => {
  const {
    user,
    userProfile,
    isAdmin,
    updateDisplayName,
    toggleFavorite,
    clearRecentTools,
    refreshProfile,
    sendVerificationEmailAgain,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'recent'>(initialTab);
  const [displayNameInput, setDisplayNameInput] = useState<string>('');
  const [isSavingName, setIsSavingName] = useState<boolean>(false);
  const [nameSaveSuccess, setNameSaveSuccess] = useState<boolean>(false);
  const [nameSaveError, setNameSaveError] = useState<string | null>(null);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshSuccess, setRefreshSuccess] = useState<boolean>(false);

  const [isSendingVerification, setIsSendingVerification] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  const [copiedUid, setCopiedUid] = useState<boolean>(false);

  // Sync initial tab if prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sync display name input from userProfile
  useEffect(() => {
    if (userProfile?.displayName || user?.displayName) {
      setDisplayNameInput(userProfile?.displayName || user?.displayName || '');
    }
  }, [userProfile?.displayName, user?.displayName]);

  if (!user) {
    return (
      <div className="pt-32 pb-24 max-w-xl mx-auto px-4 text-center space-y-6" id="account-login-required">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Sign In to Access Your Account
        </h1>
        <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed max-w-md mx-auto">
          Sign in or create a free account to manage your profile, customize favorite tools, and track your recent utilities securely.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  // Favorited tools
  const favoritedSlugs = userProfile?.favorites || [];
  const favoriteTools = favoritedSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean) as Tool[];

  // Recent tools
  const recentItems = userProfile?.recentTools || [];
  const recentToolsWithMeta = recentItems
    .map((item) => {
      const tool = TOOLS.find((t) => t.slug === item.slug);
      return {
        ...item,
        tool,
      };
    });

  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayNameInput.trim()) {
      setNameSaveError('Display name cannot be empty');
      return;
    }

    setIsSavingName(true);
    setNameSaveError(null);
    setNameSaveSuccess(false);

    try {
      await updateDisplayName(displayNameInput.trim());
      setNameSaveSuccess(true);
      setTimeout(() => setNameSaveSuccess(false), 3000);
    } catch (err: any) {
      setNameSaveError(err?.message || 'Failed to update display name');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSuccess(false);
    try {
      await refreshProfile();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    setVerificationSent(false);
    try {
      await sendVerificationEmailAgain();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleCopyUid = () => {
    if (user.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Recently';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Member';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="account-view">
      {/* Account Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0c0e17]/80 border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {userProfile?.photoURL || user.photoURL ? (
              <img
                src={userProfile?.photoURL || user.photoURL || ''}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-indigo-500/30 shadow-md"
              />
            ) : (
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-2xl font-bold text-white shadow-md ${
                  isAdmin
                    ? 'bg-gradient-to-tr from-amber-500 to-indigo-600'
                    : 'bg-gradient-to-tr from-indigo-600 to-cyan-500'
                }`}
              >
                {initial}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {displayName}
                </h1>
                {isAdmin ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                    Admin
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/[0.08]">
                    Member
                  </span>
                )}
                {user.emailVerified ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Unverified
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 font-mono">
                {user.email}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-neutral-400">
                <span>
                  Provider:{' '}
                  <strong className="text-slate-700 dark:text-neutral-200 font-semibold uppercase">
                    {userProfile?.provider || 'Email/Password'}
                  </strong>
                </span>
                <span>&bull;</span>
                <span>
                  Favorites: <strong className="text-slate-700 dark:text-neutral-200">{favoritedSlugs.length}</strong>
                </span>
                <span>&bull;</span>
                <span>
                  Recent: <strong className="text-slate-700 dark:text-neutral-200">{recentItems.length}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              id="account-refresh-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
              <span>{refreshSuccess ? 'Profile Refreshed!' : isRefreshing ? 'Refreshing...' : 'Refresh State'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                id="account-admin-dashboard-btn"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/[0.08] gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('profile')}
          id="account-tab-profile"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10'
              : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          id="account-tab-favorites"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 cursor-pointer ${
            activeTab === 'favorites'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10'
              : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Favorite Tools</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-neutral-300">
            {favoritedSlugs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          id="account-tab-recent"
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-2xl transition-all border-b-2 cursor-pointer ${
            activeTab === 'recent'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10'
              : 'border-transparent text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Recently Used</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-neutral-300">
            {recentItems.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PROFILE & SECURITY */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200" id="profile-tab-content">
          {/* Left Column: Editable Information */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-5">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                <span>Personal Information</span>
              </h3>

              <form onSubmit={handleSaveDisplayName} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="account-display-name-input"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={user.email || ''}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] text-xs text-slate-500 dark:text-neutral-400 font-mono cursor-not-allowed"
                    />
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
                    Email address is tied to your login provider and cannot be modified directly.
                  </p>
                </div>

                {nameSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Display name updated successfully!</span>
                  </div>
                )}

                {nameSaveError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/20 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{nameSaveError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingName}
                    id="account-save-profile-btn"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    {isSavingName ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Email Verification Card if Unverified */}
            {!user.emailVerified && (
              <div className="p-6 rounded-3xl bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Email Verification Pending</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Your email is not verified yet. Verifying your email helps secure your account recovery options.
                </p>

                {verificationSent ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Verification email sent! Check your inbox.</span>
                  </div>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={isSendingVerification}
                    id="account-resend-verification-btn"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {isSendingVerification ? 'Sending Email...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Account Metadata & Privacy Notice */}
          <div className="lg:col-span-5 space-y-6">
            {/* Account Details */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-purple-500" />
                <span>Account Security & ID</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] space-y-1">
                  <span className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
                    User UID
                  </span>
                  <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-slate-700 dark:text-neutral-300 truncate">
                    <span className="truncate">{user.uid}</span>
                    <button
                      onClick={handleCopyUid}
                      title="Copy UID"
                      className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                    >
                      {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">
                      Account Role
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-neutral-200 capitalize mt-0.5 block">
                      {userProfile?.role || 'user'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">
                      Created Date
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-neutral-200 mt-0.5 block">
                      {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                </div>

                {userProfile?.lastLoginAt && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]">
                    <span className="text-slate-400 dark:text-neutral-500 text-[10px] uppercase font-bold tracking-wider block">
                      Last Active Login
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-neutral-200 mt-0.5 block">
                      {new Date(userProfile.lastLoginAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Strict Browser-First Privacy Notice */}
            <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-500/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% In-Browser Privacy Guarantee</span>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                "Your tool files and tool inputs remain in your browser. Toolsbar does not store your uploaded files or tool contents."
              </p>
              <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-500/15 text-[11px] text-slate-600 dark:text-neutral-400 space-y-1">
                <div>&bull; Only tool bookmarks and recent view timestamps are saved.</div>
                <div>&bull; Zero document or file content transmission.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="favorites-tab-content">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Your Favorite Tools ({favoriteTools.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Quick access shortcuts saved to your private account
              </p>
            </div>

            {favoriteTools.length > 0 && (
              <button
                onClick={() => onNavigate('tools')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore More Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {favoriteTools.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Star className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                No Favorite Tools Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                Click the star icon on any tool card or tool launch page to save your most frequently used utilities right here.
              </p>
              <button
                onClick={() => onNavigate('tools')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Browse All 43 Tools
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => onNavigate(`tools/${tool.slug}`)}
                  onOpenAuth={onOpenAuth}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RECENTLY USED */}
      {activeTab === 'recent' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="recent-tab-content">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                <span>Recently Used Utilities ({recentToolsWithMeta.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Quick chronological history of tools you opened recently
              </p>
            </div>

            {recentToolsWithMeta.length > 0 && (
              <button
                onClick={clearRecentTools}
                id="account-clear-recent-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {recentToolsWithMeta.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] text-center space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                No Recent Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                As you launch and use tools across Toolsbar, your recent utilities will automatically appear here for quick continuation.
              </p>
              <button
                onClick={() => onNavigate('tools')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Explore Tool Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentToolsWithMeta.map((item) => {
                const tool = item.tool;
                if (!tool) return null;
                const category = CATEGORIES.find((c) => c.id === tool.category);

                return (
                  <div
                    key={item.slug}
                    onClick={() => onNavigate(`tools/${item.slug}`)}
                    className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-500/40 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                          {category?.name || tool.category}
                        </span>
                        <span className="text-slate-400 dark:text-neutral-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(item.lastUsedAt)}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {tool.name}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {tool.shortDesc || tool.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reassurance Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400">
            <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              History only records tool names and access timestamps. Your input text, calculations, file contents, and images are never logged or stored.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
