import React, { useState, useEffect } from 'react';
import { 
  Moon, Sun, Menu, X, 
  Layers, Flame, Grid, ShieldCheck, LogOut, User as UserIcon
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

  const navItems = [
    { label: 'All Tools', path: 'tools', icon: Grid },
    { label: 'Categories', path: 'categories', icon: Layers },
    { label: 'Popular', path: 'popular', icon: Flame },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-white/80 dark:bg-[#030303]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] shadow-md dark:shadow-2xl'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo / Brand */}
          <button
            onClick={() => { onNavigate(''); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            id="header-logo-btn"
            aria-label="Toolsbar Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-white dark:bg-[#030303] rounded-[11px] flex items-center justify-center p-1.5">
                <ToolsbarLogo className="w-full h-full text-indigo-600 dark:text-white group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
                Toolsbar
              </span>
            </div>
          </button>

          {/* CENTER / NAVIGATION: Desktop Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path === 'tools' && currentPath.startsWith('tools/'));
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-white/10'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Actions (Theme Toggle + Auth Controls) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Auth Controls */}
            {user ? (
              <UserMenu onNavigate={onNavigate} />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSignIn}
                  id="header-signin-btn"
                  className="hidden sm:inline-block px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                <button
                  onClick={onOpenRegister}
                  id="header-register-btn"
                  className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 border border-slate-200/80 dark:border-transparent font-semibold text-xs tracking-normal transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-700 hover:text-slate-900 dark:text-neutral-300 dark:hover:text-white cursor-pointer"
              id="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-2xl bg-white/95 dark:bg-[#0a0c12]/95 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || (item.path === 'tools' && currentPath.startsWith('tools/'));
                return (
                  <button
                    key={item.path}
                    onClick={() => { onNavigate(item.path); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}

              {isAdmin && (
                <button
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/15"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] text-xs text-slate-600 dark:text-neutral-300 font-mono truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs transition-all text-center flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onOpenSignIn?.(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-semibold text-xs transition-all text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onOpenRegister?.(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-950 font-semibold text-xs transition-all text-center shadow-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

