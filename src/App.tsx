import React, { useState, useEffect, useCallback } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  useNavigate, 
  useLocation, 
  useParams 
} from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/common/AuthModal';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { ToolLayout } from './components/common/ToolLayout';
import { HomeView } from './components/views/HomeView';
import { ToolsDirectoryView } from './components/views/ToolsDirectoryView';
import { CategoriesView } from './components/views/CategoriesView';
import { CategoryDetailView } from './components/views/CategoryDetailView';
import { PopularView } from './components/views/PopularView';
import { AdminView } from './components/views/AdminView';
import { AccountView } from './components/views/AccountView';
import { PrivacyView } from './components/views/PrivacyView';
import { TermsView } from './components/views/TermsView';
import { ContactView } from './components/views/ContactView';
import { RetiredToolView } from './components/views/RetiredToolView';
import { AiToolsDirectoryView } from './components/views/AiToolsDirectoryView';
import { AiToolDetailView } from './components/views/AiToolDetailView';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { getToolBySlug, TOOLS, LEGACY_ROUTE_MAP, RETIRED_TOOLS } from './data/tools';
import { CATEGORIES } from './data/categories';
import { AI_CATEGORIES, getAiCategoryBySlug } from './data/aiCategories';
import { getAiToolBySlug } from './data/aiToolsData';
import { getAiToolBySlugLive } from './services/aiToolsService';
import { AiTool } from './types/aiTools';
import { 
  applyPageSEO, 
  getToolSEOMetadata, 
  getCategorySEOMetadata, 
  getStaticRouteSEOMetadata 
} from './utils/seo';
import { applyAdSenseRoutePolicy } from './utils/adSensePolicy';

// Route Wrappers with Dynamic Per-Page SEO & JSON-LD Injection

function AiToolsDirectoryRouteWrapper({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}) {
  useEffect(() => {
    applyPageSEO({
      title: 'Discover AI Tools — The Modern AI Directory & Guides — Toolsbar',
      description: 'Discover and compare top artificial intelligence tools for video, coding, writing, research, and design. Verified pricing and direct links to official websites.',
      canonicalPath: 'ai-tools',
    });
  }, []);

  return <AiToolsDirectoryView onNavigate={onNavigate} onOpenAuth={onOpenAuth} />;
}

function AiToolRouteWrapper({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}) {
  const { slug } = useParams<{ slug: string }>();
  const [liveTool, setLiveTool] = useState<AiTool | undefined>(() => slug ? getAiToolBySlug(slug) : undefined);
  const category = slug ? getAiCategoryBySlug(slug) : undefined;

  useEffect(() => {
    if (!slug) return;
    if (category) {
      applyPageSEO({
        title: `${category.name} AI Tools — Directory & Guide — Toolsbar`,
        description: category.shortDesc,
        canonicalPath: `ai-tools/${category.slug}`,
      });
      return;
    }

    const cached = getAiToolBySlug(slug);
    if (cached) {
      setLiveTool(cached);
      applyPageSEO({
        title: cached.seoTitle || `${cached.name} — Review, Pricing & Official Access — Toolsbar`,
        description: cached.seoDescription || cached.shortDescription,
        canonicalPath: `ai-tools/${cached.slug}`,
      });
    } else {
      getAiToolBySlugLive(slug).then((t) => {
        if (t) {
          setLiveTool(t);
          applyPageSEO({
            title: t.seoTitle || `${t.name} — Review, Pricing & Official Access — Toolsbar`,
            description: t.seoDescription || t.shortDescription,
            canonicalPath: `ai-tools/${t.slug}`,
          });
        } else {
          applyPageSEO({
            title: 'AI Tool Not Found — Toolsbar',
            description: 'The requested artificial intelligence tool could not be found in our catalog.',
            canonicalPath: `ai-tools/${slug}`,
            noindex: true,
          });
        }
      });
    }
  }, [slug, category]);

  if (category) {
    return <AiToolsDirectoryView onNavigate={onNavigate} onOpenAuth={onOpenAuth} initialCategorySlug={category.slug} />;
  }

  if (liveTool) {
    return <AiToolDetailView tool={liveTool} onNavigate={onNavigate} onOpenAuth={onOpenAuth} />;
  }

  return (
    <div className="pt-36 pb-24 max-w-2xl mx-auto px-4 text-center space-y-6">
      <div className="text-6xl font-mono font-bold text-indigo-400">404</div>
      <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">AI Tool Not Found</h1>
      <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
        The requested AI software record could not be found in our catalog or has been relocated.
      </p>
      <button
        onClick={() => onNavigate('ai-tools')}
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
      >
        Browse All AI Tools
      </button>
    </div>
  );
}

function HomeRouteWrapper({
  onNavigate,
  onOpenSearch,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenSearch: (query?: string) => void;
  onOpenAuth?: () => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata(''));
  }, []);

  return <HomeView onNavigate={onNavigate} onOpenSearch={onOpenSearch} onOpenAuth={onOpenAuth} />;
}

function ToolsDirectoryRouteWrapper({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata('tools'));
  }, []);

  return <ToolsDirectoryView onNavigate={onNavigate} onOpenAuth={onOpenAuth} />;
}

function CategoriesRouteWrapper({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata('categories'));
  }, []);

  return <CategoriesView onNavigate={onNavigate} />;
}

function PopularRouteWrapper({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata('popular'));
  }, []);

  return <PopularView onNavigate={onNavigate} onOpenAuth={onOpenAuth} />;
}

function PrivacyRouteWrapper({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata('privacy'));
  }, []);

  return <PrivacyView onNavigate={onNavigate} />;
}

function TermsRouteWrapper({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata('terms'));
  }, []);

  return <TermsView onNavigate={onNavigate} />;
}

function ContactRouteWrapper({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  useEffect(() => {
    applyPageSEO(getStaticRouteSEOMetadata('contact'));
  }, []);

  return <ContactView onNavigate={onNavigate} />;
}

function ToolRouteWrapper({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}) {
  const { toolSlug } = useParams<{ toolSlug: string }>();

  // 1. Instant alias redirect for absorbed / historical tool routes with close replacements
  if (toolSlug && LEGACY_ROUTE_MAP[toolSlug]) {
    return <Navigate to={LEGACY_ROUTE_MAP[toolSlug]} replace />;
  }

  // 2. Check for retired tool routes with no genuine replacement (BMI, Average, Color Palette)
  const retiredInfo = toolSlug ? RETIRED_TOOLS[toolSlug] : undefined;

  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  const category = tool ? CATEGORIES.find((c) => c.id === tool.category) : undefined;

  useEffect(() => {
    if (retiredInfo) {
      applyPageSEO({
        title: `${retiredInfo.name} (Retired) — Toolsbar`,
        description: retiredInfo.reason,
        canonicalPath: `tools/${retiredInfo.slug}`,
        noindex: true,
      });
    } else if (tool) {
      applyPageSEO(getToolSEOMetadata(tool, category));
    } else {
      applyPageSEO({
        title: 'Tool Not Found — Toolsbar',
        description: 'The requested digital tool could not be found in our catalog.',
        canonicalPath: `tools/${toolSlug || ''}`,
        noindex: true,
      });
    }
  }, [tool, category, toolSlug, retiredInfo]);

  if (retiredInfo) {
    return <RetiredToolView toolInfo={retiredInfo} onNavigate={onNavigate} />;
  }

  if (!tool) {
    return (
      <div className="pt-36 pb-24 max-w-2xl mx-auto px-4 text-center space-y-6" id="tool-not-found">
        <div className="text-6xl font-mono font-bold text-indigo-400">404</div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Tool Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
          The requested utility could not be found or may have been relocated in our registry.
        </p>
        <button
          onClick={() => onNavigate('tools')}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
        >
          Browse All Available Tools
        </button>
      </div>
    );
  }

  return <ToolLayout tool={tool} onNavigate={onNavigate} onOpenAuth={onOpenAuth} />;
}

function AccountRouteWrapper({
  onNavigate,
  onOpenAuth,
  forcedTab,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
  forcedTab?: 'profile' | 'favorites' | 'recent';
}) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = (forcedTab || searchParams.get('tab') || 'profile') as 'profile' | 'favorites' | 'recent';

  useEffect(() => {
    applyPageSEO({
      title: 'My Account & Preferences — Toolsbar',
      description: 'Manage your profile, saved favorite tools, and recent history securely on Toolsbar.',
      canonicalPath: 'account',
    });
  }, []);

  return (
    <AccountView
      initialTab={['profile', 'favorites', 'recent'].includes(tabParam) ? tabParam : 'profile'}
      onNavigate={onNavigate}
      onOpenAuth={onOpenAuth}
    />
  );
}

function CategoryRouteWrapper({
  onNavigate,
  onOpenAuth,
}: {
  onNavigate: (path: string) => void;
  onOpenAuth?: () => void;
}) {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = CATEGORIES.find(
    (c) => c.id === categorySlug || c.slug === categorySlug
  );
  const toolCount = category ? TOOLS.filter((t) => t.category === category.id).length : 0;

  useEffect(() => {
    if (category) {
      applyPageSEO(getCategorySEOMetadata(category, toolCount));
    } else {
      applyPageSEO({
        title: 'Category Not Found — Toolsbar',
        description: 'The requested tool category could not be found.',
        canonicalPath: `category/${categorySlug || ''}`,
      });
    }
  }, [category, toolCount, categorySlug]);

  if (!category) {
    return (
      <div className="pt-36 pb-24 max-w-2xl mx-auto px-4 text-center space-y-6" id="category-not-found">
        <div className="text-6xl font-mono font-bold text-indigo-400">404</div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Category Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
          The requested category does not exist in our catalog.
        </p>
        <button
          onClick={() => onNavigate('categories')}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
        >
          View All Categories
        </button>
      </div>
    );
  }

  return <CategoryDetailView categoryId={category.id} onNavigate={onNavigate} onOpenAuth={onOpenAuth} />;
}

function NotFoundRoute({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  useEffect(() => {
    applyPageSEO({
      title: 'Page Not Found — 404 — Toolsbar',
      description: 'The requested page could not be found on Toolsbar.',
      canonicalPath: '',
    });
  }, []);

  return (
    <div className="pt-36 pb-24 max-w-2xl mx-auto px-4 text-center space-y-6" id="not-found-page">
      <div className="text-7xl font-mono font-extrabold text-indigo-500">404</div>
      <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
        We couldn't find the page you're looking for. It might have been moved or the URL may be misspelled.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('')}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
        >
          Return to Home
        </button>
        <button
          onClick={() => onNavigate('tools')}
          className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs transition-all cursor-pointer border border-slate-200 dark:border-white/10"
        >
          Explore All Tools
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot_password'>('register');

  const openSearch = useCallback((query?: string) => {
    setSearchInitialQuery(query || '');
    setIsSearchOpen(true);
  }, []);

  // Normalize current path for Header & Navigation (e.g. 'tools', 'tools/percentage-calculator', 'admin', '')
  const currentPath = location.pathname.replace(/^\//, '');

  // Backward compatibility: automatically migrate legacy hash routes (e.g. /#/tools/percentage-calculator) to clean URLs
  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      const clean = window.location.hash.replace(/^#\/?/, '/');
      navigate(clean, { replace: true });
    }
  }, [navigate]);

  // Global Cmd/Ctrl + K shortcut to toggle search modal from anywhere
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Load AdSense only on real publisher-content routes. Directory, navigation, private,
  // retired, error, and empty screens are treated as non-eligible so Auto Ads cannot appear.
  useEffect(() => {
    const path = location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const isHome = path === '/';
    const toolMatch = path.match(/^\/tools\/([^/]+)$/);
    const aiToolMatch = path.match(/^\/ai-tools\/([^/]+)$/);
    const isValidFlagship =
      !!toolMatch &&
      !RETIRED_TOOLS[toolMatch[1]] &&
      !!getToolBySlug(toolMatch[1]);
    const isPublishedAiTool =
      !!aiToolMatch &&
      !AI_CATEGORIES.some((c) => c.slug === aiToolMatch[1]) &&
      !!getAiToolBySlug(aiToolMatch[1])?.isPublished;

    // Only homepage, 12 active flagship tools, and published AI tool pages are eligible for AdSense
    const hasSubstantialContent = isHome || isValidFlagship || isPublishedAiTool;

    applyAdSenseRoutePolicy(path, { hasSubstantialContent });
  }, [location.pathname]);


  // Programmatic navigation handler with smooth scroll
  const handleNavigate = useCallback(
    (path: string) => {
      let clean = path.trim();
      if (clean.startsWith('#/')) clean = clean.slice(2);
      else if (clean.startsWith('#')) clean = clean.slice(1);

      if (!clean || clean === '/') {
        navigate('/');
      } else {
        navigate(clean.startsWith('/') ? clean : `/${clean}`);
      }

      setIsSearchOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [navigate]
  );

  const openRegister = () => {
    setAuthView('register');
    setIsAuthOpen(true);
  };

  const openSignIn = () => {
    setAuthView('login');
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300 relative overflow-x-hidden">
      {/* Restrained Layered Ambient Background for Frosted Glass Depth */}
      <div className="page-ambient-bg pointer-events-none" aria-hidden="true" />
      <div className="page-dot-matrix pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => openSearch()}
        onOpenRegister={openRegister}
        onOpenSignIn={openSignIn}
      />

      {/* Main Routed Content */}
      <main className="flex-1 relative z-10 animate-page-enter" key={location.pathname}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeRouteWrapper
                onNavigate={handleNavigate}
                onOpenSearch={openSearch}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/tools"
            element={
              <ToolsDirectoryRouteWrapper
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/ai-tools"
            element={
              <AiToolsDirectoryRouteWrapper
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/ai-tools/:slug"
            element={
              <AiToolRouteWrapper
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/categories"
            element={<CategoriesRouteWrapper onNavigate={handleNavigate} />}
          />
          <Route
            path="/popular"
            element={
              <PopularRouteWrapper
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/tools/:toolSlug"
            element={
              <ToolRouteWrapper
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/category/:categorySlug"
            element={
              <CategoryRouteWrapper
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              />
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              >
                <AccountRouteWrapper
                  onNavigate={handleNavigate}
                  onOpenAuth={openSignIn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              >
                <AccountRouteWrapper
                  forcedTab="profile"
                  onNavigate={handleNavigate}
                  onOpenAuth={openSignIn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              >
                <AccountRouteWrapper
                  forcedTab="favorites"
                  onNavigate={handleNavigate}
                  onOpenAuth={openSignIn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recent"
            element={
              <ProtectedRoute
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              >
                <AccountRouteWrapper
                  forcedTab="recent"
                  onNavigate={handleNavigate}
                  onOpenAuth={openSignIn}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                requireAdmin
                onNavigate={handleNavigate}
                onOpenAuth={openSignIn}
              >
                <AdminView onNavigate={handleNavigate} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={<PrivacyRouteWrapper onNavigate={handleNavigate} />}
          />
          <Route
            path="/terms"
            element={<TermsRouteWrapper onNavigate={handleNavigate} />}
          />
          <Route
            path="/contact"
            element={<ContactRouteWrapper onNavigate={handleNavigate} />}
          />
          <Route
            path="*"
            element={<NotFoundRoute onNavigate={handleNavigate} />}
          />
        </Routes>
      </main>

      {/* Global Search Command Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        initialQuery={searchInitialQuery}
        onClose={() => {
          setIsSearchOpen(false);
          setSearchInitialQuery('');
        }}
        onNavigate={handleNavigate}
        onSelectTool={(slug) => handleNavigate(`tools/${slug}`)}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialView={authView}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
