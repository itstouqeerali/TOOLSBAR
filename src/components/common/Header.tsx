import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Sun, Menu, X, 
  Sparkles, Wrench, Search, LogOut, User as UserIcon,
  Bot, Image as ImageIcon, Video, Mic, Code2, GraduationCap, PenTool, Presentation,
  FileText, FileImage, Layers, Percent, TrendingUp, Binary, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, ChevronRight
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
  const { user, userProfile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [aiTasksOpen, setAiTasksOpen] = useState<boolean>(true);
  const [utilitiesOpen, setUtilitiesOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  const isAiActive = currentPath === 'ai-tools' || currentPath.startsWith('ai-tools/');
  const isUtilitiesActive = currentPath === 'tools' || currentPath.startsWith('tools/');

  const aiTaskLinks = [
    { label: 'Chat & Assistants', path: 'ai-tools/chat-assistants', icon: Bot, color: 'text-cyan-500' },
    { label: 'Image Generation', path: 'ai-tools/image-generation', icon: ImageIcon, color: 'text-pink-500' },
    { label: 'Video Generation', path: 'ai-tools/video-generation', icon: Video, color: 'text-violet-500' },
    { label: 'Audio & Music', path: 'ai-tools/audio-voice-music', icon: Mic, color: 'text-amber-500' },
    { label: 'Coding & Dev', path: 'ai-tools/coding-development', icon: Code2, color: 'text-blue-500' },
    { label: 'Study & Research', path: 'ai-tools/study-research', icon: GraduationCap, color: 'text-emerald-500' },
    { label: 'Writing & SEO', path: 'ai-tools/writing-content', icon: PenTool, color: 'text-rose-500' },
    { label: 'Design & Slides', path: 'ai-tools/design-presentations', icon: Presentation, color: 'text-purple-500' },
  ];

  const utilityLinks = [
    { label: 'PDF Toolkit', path: 'tools/pdf-toolkit', icon: Layers, badge: 'Flagship' },
    { label: 'Image Toolkit', path: 'tools/image-toolkit', icon: ImageIcon, badge: 'Compress' },
    { label: 'Text to PDF', path: 'tools/text-to-pdf', icon: FileText, badge: 'Rich' },
    { label: 'Images to PDF', path: 'tools/images-to-pdf', icon: FileImage, badge: 'Combine' },
    { label: 'Percentage Calculator', path: 'tools/percentage-calculator', icon: Percent, badge: '8 Modes' },
    { label: 'Finance Calculator', path: 'tools/finance-calculator', icon: TrendingUp, badge: 'Compound' },
    { label: 'JSON Studio', path: 'tools/json-studio', icon: Binary, badge: 'Tree' },
    { label: 'Developer Toolbox', path: 'tools/developer-toolbox', icon: Code2, badge: 'Swiss Army' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 glass-header ${
          isScrolled ? 'py-2.5 sm:py-3' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT: Logo / Brand (Crawlable Semantic Link) */}
            <Link
              to="/"
              onClick={closeDrawer}
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
            </Link>

            {/* RIGHT: Theme Toggle + Desktop Auth Controls + Mobile Hamburger Menu */}
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
                  <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 animate-in spin-in-180 duration-300" />
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

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                id="mobile-menu-toggle-btn"
                className="p-2 rounded-xl glass-button md:hidden text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer shrink-0"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CENTER / PRIMARY NAVIGATION: Centered across desktop header */}
          <nav 
            aria-label="Main Navigation"
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-1.5 p-1 rounded-2xl glass-panel shadow-inner border border-slate-200/80 dark:border-white/10 pointer-events-auto z-10"
          >
            <Link
              to="/ai-tools"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isAiActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tools</span>
            </Link>

            <Link
              to="/tools"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isUtilitiesActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Utilities</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* FULL SLIDE-OVER SIDEBAR DRAWER (Mobile + Desktop Explorer) */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Navigation Drawer">
            {/* Backdrop with smooth blur */}
            <motion.div 
              onClick={closeDrawer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Slide-over Drawer Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-[#0c0e18] shadow-2xl border-l border-slate-200/90 dark:border-white/10 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
              <Link to="/" onClick={closeDrawer} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px]">
                  <div className="w-full h-full bg-white dark:bg-[#0c0e18] rounded-[11px] flex items-center justify-center p-1.5">
                    <ToolsbarLogo className="w-full h-full text-indigo-600 dark:text-white" />
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-base font-bold font-display text-slate-900 dark:text-white leading-none">Toolsbar</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase tracking-wider mt-0.5">Navigation Menu</span>
                </div>
              </Link>

              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Search Bar Button */}
              {onOpenSearch && (
                <button
                  type="button"
                  onClick={() => { closeDrawer(); onOpenSearch(); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs"
                >
                  <Search className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Search AI tools & utilities...</span>
                </button>
              )}

              {/* Main Sections */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-neutral-500 px-2 block">
                  Main Sections
                </span>
                <Link
                  to="/"
                  onClick={closeDrawer}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span>Home</span>
                  <span className="text-[10px] opacity-60">Landing</span>
                </Link>
                <Link
                  to="/ai-tools"
                  onClick={closeDrawer}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Tools Finder
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">80+ Tools</span>
                </Link>
                <Link
                  to="/tools"
                  onClick={closeDrawer}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-emerald-500" /> Daily Browser Utilities
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">12 Free</span>
                </Link>
                <Link
                  to="/popular"
                  onClick={closeDrawer}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span>Popular Tools</span>
                  <span className="text-[10px] opacity-60">Trending</span>
                </Link>
                <Link
                  to="/categories"
                  onClick={closeDrawer}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <span>All Categories</span>
                  <span className="text-[10px] opacity-60">Full Catalog</span>
                </Link>
              </div>

              {/* Collapsible Accordion: Find AI By Task */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setAiTasksOpen(!aiTasksOpen)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                  aria-expanded={aiTasksOpen}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                      Find AI By Task
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                      8 Tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to="/ai-tools"
                      onClick={(e) => { e.stopPropagation(); closeDrawer(); }}
                      className="text-[10px] font-semibold text-indigo-500 hover:underline px-1"
                    >
                      All
                    </Link>
                    {aiTasksOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 dark:text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-neutral-400" />
                    )}
                  </div>
                </button>

                {aiTasksOpen && (
                  <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
                    {aiTaskLinks.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={`/${item.path}`}
                          onClick={closeDrawer}
                          className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#0c0e18] border border-slate-200/60 dark:border-white/[0.06] text-[11px] font-medium text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/30 transition-all truncate shadow-2xs"
                        >
                          <IconComp className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Collapsible Accordion: Free Browser Utilities */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden bg-slate-50/50 dark:bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setUtilitiesOpen(!utilitiesOpen)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                  aria-expanded={utilitiesOpen}
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                      Free Browser Utilities
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                      12 Free
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hidden xs:inline">
                      Local
                    </span>
                    {utilitiesOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 dark:text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-neutral-400" />
                    )}
                  </div>
                </button>

                {utilitiesOpen && (
                  <div className="p-2.5 pt-0 grid grid-cols-2 gap-1.5 animate-in fade-in duration-200">
                    {utilityLinks.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={`/${item.path}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#0c0e18] border border-slate-200/60 dark:border-white/[0.06] text-[11px] font-medium text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/30 transition-all shadow-2xs"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <IconComp className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer: User Auth & Legal */}
            <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-black/30 space-y-3">
              {user ? (
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to="/account"
                    onClick={closeDrawer}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-white truncate"
                  >
                    <UserIcon className="w-4 h-4 text-indigo-500" />
                    <span className="truncate">{userProfile?.displayName || user.displayName || 'My Account'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => { closeDrawer(); signOut(); }}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { closeDrawer(); onOpenSignIn?.(); }}
                    className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-neutral-300 text-center glass-button cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { closeDrawer(); onOpenRegister?.(); }}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold text-center shadow-sm shadow-indigo-600/20 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Legal Links */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-500 pt-1 border-t border-slate-200/60 dark:border-white/[0.04]">
                <Link to="/privacy" onClick={closeDrawer} className="hover:underline">Privacy</Link>
                <span className="opacity-40">|</span>
                <Link to="/terms" onClick={closeDrawer} className="hover:underline">Terms</Link>
                <span className="opacity-40">|</span>
                <Link to="/contact" onClick={closeDrawer} className="hover:underline">Contact Support</Link>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  </>
  );
};
