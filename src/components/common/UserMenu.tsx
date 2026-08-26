import React, { useState, useRef, useEffect } from 'react';
import { 
  User, ShieldCheck, LogOut, ChevronDown, 
  ExternalLink, Sparkles, Star, Clock, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  onNavigate: (path: string) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate }) => {
  const { user, userProfile, isAdmin, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Member';
  const initial = displayName.charAt(0).toUpperCase();
  const favoritesCount = userProfile?.favorites?.length || 0;
  const recentCount = userProfile?.recentTools?.length || 0;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="header-user-menu-btn"
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/[0.08] text-slate-800 dark:text-neutral-200 transition-all cursor-pointer shadow-sm text-xs"
        aria-label="User account menu"
      >
        {userProfile?.photoURL || user.photoURL ? (
          <img
            src={userProfile?.photoURL || user.photoURL || ''}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover shadow-sm"
          />
        ) : (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm ${
            isAdmin ? 'bg-gradient-to-tr from-amber-500 to-indigo-600' : 'bg-gradient-to-tr from-indigo-600 to-cyan-500'
          }`}>
            {initial}
          </div>
        )}
        <span className="font-medium max-w-[90px] truncate hidden sm:inline-block">
          {displayName}
        </span>
        {isAdmin && (
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Admin
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="header-user-dropdown"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200 dark:border-white/[0.12] p-2 backdrop-blur-2xl shadow-2xl space-y-1 z-50 animate-in fade-in slide-from-top-2 duration-150 text-left"
        >
          {/* User Details Box */}
          <div 
            onClick={() => {
              setIsOpen(false);
              onNavigate('account');
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-slate-100 dark:border-white/[0.04] mb-1 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {displayName}
              </span>
              {isAdmin ? (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                  Admin
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold uppercase bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-neutral-300 shrink-0">
                  Member
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-neutral-400 truncate block mt-0.5 font-mono">
              {user.email}
            </span>
          </div>

          {/* Profile / My Account */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNavigate('account?tab=profile');
            }}
            id="user-menu-profile-link"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>Profile / My Account</span>
            </div>
          </button>

          {/* Favorites */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNavigate('account?tab=favorites');
            }}
            id="user-menu-favorites-link"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span>Favorites</span>
            </div>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Recently Used */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNavigate('account?tab=recent');
            }}
            id="user-menu-recent-link"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Recently Used</span>
            </div>
            {recentCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold">
                {recentCount}
              </span>
            )}
          </button>

          {/* Admin Panel Link if Admin */}
          {isAdmin && (
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigate('admin');
              }}
              id="user-menu-admin-link"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer border-t border-slate-100 dark:border-white/[0.04] pt-2"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>
          )}

          <div className="border-t border-slate-100 dark:border-white/[0.04] pt-1 mt-1">
            {/* Sign Out Button */}
            <button
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              id="user-menu-signout-btn"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
