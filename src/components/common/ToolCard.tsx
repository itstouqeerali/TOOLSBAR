import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Percent,
  Calendar,
  FileText,
  Type,
  CaseSensitive,
  Code2,
  Binary,
  Scale,
  QrCode,
  KeyRound,
  Activity,
  Tag,
  BarChart3,
  Split,
  Landmark,
  TrendingUp,
  CreditCard,
  Receipt,
  ListFilter,
  AlignLeft,
  ArrowUpDown,
  Link2,
  Minimize2,
  Globe,
  Fingerprint,
  Search,
  ShieldCheck,
  HardDrive,
  Thermometer,
  FileSpreadsheet,
  Image,
  Maximize2,
  Palette,
  Clock,
  Layers,
  Scissors,
  FileCode,
  Star
} from 'lucide-react';
import { Tool } from '../../types';
import { CATEGORIES, CATEGORY_STYLES } from '../../data/categories';
import { useAuth } from '../../context/AuthContext';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  onOpenAuth?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Percent,
  Calendar,
  FileText,
  Type,
  CaseSensitive,
  Code2,
  Binary,
  Scale,
  QrCode,
  KeyRound,
  Activity,
  Tag,
  BarChart3,
  Split,
  Landmark,
  TrendingUp,
  CreditCard,
  Receipt,
  ListFilter,
  AlignLeft,
  ArrowUpDown,
  Link2,
  Minimize2,
  Globe,
  Fingerprint,
  Search,
  ShieldCheck,
  HardDrive,
  Thermometer,
  FileSpreadsheet,
  Image,
  Maximize2,
  Palette,
  Sparkles,
  Layers,
  Scissors,
  FileCode,
  Clock,
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, onOpenAuth }) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const category = CATEGORIES.find(c => c.id === tool.category);
  const IconComponent = (tool.icon && ICON_MAP[tool.icon]) || Sparkles;
  const isReady = tool.isImplemented && tool.status !== 'coming-soon';
  const style = CATEGORY_STYLES[tool.category] || CATEGORY_STYLES.calculators;
  const favorited = isFavorite(tool.slug);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleFavorite(tool.slug);
    } else if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <div
      onClick={onClick}
      id={`tool-card-${tool.slug}`}
      className={`group relative rounded-3xl p-6 border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        isReady
          ? 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-indigo-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:bg-white/[0.025] dark:hover:bg-white/[0.055] dark:border-white/[0.08] dark:hover:border-indigo-500/40 dark:hover:shadow-2xl dark:hover:shadow-indigo-500/10'
          : 'bg-slate-100/50 hover:bg-slate-100/80 border-slate-200/60 dark:bg-white/[0.01] dark:hover:bg-white/[0.025] dark:border-white/[0.04] dark:hover:border-white/10 opacity-75'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
              isReady
                ? `${style.iconBg} border ${style.border} ${style.iconText} group-hover:scale-105 ${style.hoverBg} group-hover:border-transparent group-hover:text-white`
                : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-neutral-500'
            }`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {isReady && (
              <button
                type="button"
                onClick={handleFavoriteClick}
                title={user ? (favorited ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to favorite'}
                id={`favorite-btn-${tool.slug}`}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  favorited
                    ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/30 text-amber-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200/80 dark:border-white/[0.06] text-slate-400 dark:text-neutral-500 hover:text-amber-500 hover:border-amber-300 dark:hover:text-amber-400'
                }`}
                aria-label={favorited ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
              >
                <Star className={`w-3.5 h-3.5 ${favorited ? 'fill-amber-500 text-amber-500' : ''}`} />
              </button>
            )}

            {tool.badge && isReady && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeBg} ${style.badgeText} border ${style.border}`}>
                {tool.badge}
              </span>
            )}
            {isReady ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> Ready
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800/60 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Title & Category */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
            {category?.name || tool.category}
          </span>
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
            {tool.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {tool.shortDesc || tool.description}
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
        <span className="text-[11px] text-slate-500 dark:text-neutral-400 flex items-center gap-1">
          {isReady ? (
            <>
              <Zap className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Instant in-browser
            </>
          ) : (
            <>In Development</>
          )}
        </span>
        <span className="font-semibold text-indigo-600 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          {isReady ? 'Open Tool' : 'Preview'} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
