import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Menu, X, 
  Sparkles, Wrench, Search, Command, LogOut, User as UserIcon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ToolsbarLogo } from './ToolsbarLogo';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
  onOpenRegister?: () => void;
  onOpenSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  onNavigate, 
  onOpenSearch,
  onOpenRegister,
  onOpenSignIn,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile, isAdmin, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAiActive = currentPath === 'ai-tools' || currentPath.startsWith('ai-tools/');
  const isUtilitiesActive = currentPath === 'tools' || currentPath.startsWith('tools/');

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-header ${
        isScrolled ? 'py-2.5 sm:py-3' : 'py-3.5 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Logo / Brand */}
          <button
            onClick={() => { onNavigate(''); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
            id="header-logo-btn"
            aria-label="Toolsbar Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-white dark:bg-[#0c0e18] rounded-[11px] flex items-center justify-center p-1.5">
                <ToolsbarLogo className="w-full h-full text-indigo-600 dark:text-white group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors leading-none">
                Toolsbar
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-neutral-400 tracking-wider uppercase mt-0.5">
                AI & Utilities
              </span>
            </div>
          </button>

          {/* RIGHT: Desktop Controls (Theme + Sign In + Sign Up) & Mobile Controls (Theme + Hamburger) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle - Visible on all devices */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme color"
              className="p-2 rounded-xl glass-button text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Desktop Auth Controls - Strictly hidden on mobile, shown on desktop */}
            {user ? (
              <div className="hidden md:block">
                <UserMenu onNavigate={onNavigate} />
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={onOpenSignIn}
                  id="header-signin-btn"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold glass-button text-slate-700 hover:text-slate-900 dark:text-neutral-200 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer shadow-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenRegister}
                  id="header-signup-btn"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle - Visible only on mobile (<md) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-xl glass-button md:hidden text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer shrink-0"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* CENTER / PRIMARY NAVIGATION: Absolutely & mathematically centered across desktop header */}
        <nav 
          aria-label="Main Navigation"
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-1.5 p-1 rounded-2xl glass-panel shadow-inner border border-slate-200/80 dark:border-white/10 pointer-events-auto z-10"
        >
          <button
            onClick={() => onNavigate('ai-tools')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isAiActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tools</span>
          </button>

          <button
            onClick={() => onNavigate('tools')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isUtilitiesActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Utilities</span>
          </button>
        </nav>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-3xl glass-popover border border-slate-200/90 dark:border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => { onNavigate('ai-tools'); setMobileMenuOpen(false); }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left ${
                  isAiActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4" /> AI Tools Discovery
                </span>
                <span className="text-xs opacity-75">Directory & Guides</span>
              </button>

              <button
                onClick={() => { onNavigate('tools'); setMobileMenuOpen(false); }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all text-left ${
                  isUtilitiesActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4" /> Native Utilities
                </span>
                <span className="text-xs opacity-75">12 Free Tools</span>
              </button>
            </nav>

            {onOpenSearch && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white text-xs font-semibold border border-slate-200 dark:border-white/10"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Search All AI Tools & Utilities</span>
              </button>
            )}

            {user ? (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1.5">
                <button
                  onClick={() => { setMobileMenuOpen(false); onNavigate('account'); }}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-3.5 h-3.5 text-indigo-500" /> My Account
                  </span>
                  <span className="text-[11px] opacity-75">{userProfile?.displayName || user.displayName || 'Member'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut(); }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenSignIn?.(); }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-neutral-300 text-center glass-button cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister?.(); }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold text-center shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
