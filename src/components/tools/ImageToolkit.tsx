import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Minimize2, Maximize2, Repeat, Image as ImageIcon } from 'lucide-react';
import { ImageCompressor } from './ImageCompressor';
import { ImageResizer } from './ImageResizer';
import { WebpConverter } from './WebpConverter';
import { JpgToPng } from './JpgToPng';
import { PngToJpg } from './PngToJpg';

type ImageTab = 'compress' | 'resize' | 'convert';
type ConvertSubTab = 'webp' | 'jpg-to-png' | 'png-to-jpg';

export const ImageToolkit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialState = (): { tab: ImageTab; subTab: ConvertSubTab } => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab')?.toLowerCase();
    if (tabParam === 'compress' || tabParam === 'opt' || tabParam === 'optimize') {
      return { tab: 'compress', subTab: 'webp' };
    }
    if (tabParam === 'resize' || tabParam === 'scale' || tabParam === 'dimensions') {
      return { tab: 'resize', subTab: 'webp' };
    }
    if (tabParam === 'jpg-to-png') {
      return { tab: 'convert', subTab: 'jpg-to-png' };
    }
    if (tabParam === 'png-to-jpg') {
      return { tab: 'convert', subTab: 'png-to-jpg' };
    }
    if (tabParam === 'convert' || tabParam === 'webp') {
      return { tab: 'convert', subTab: 'webp' };
    }
    return { tab: 'compress', subTab: 'webp' };
  };

  const [activeTab, setActiveTab] = useState<ImageTab>(() => getInitialState().tab);
  const [convertSubTab, setConvertSubTab] = useState<ConvertSubTab>(() => getInitialState().subTab);

  useEffect(() => {
    const next = getInitialState();
    setActiveTab(next.tab);
    setConvertSubTab(next.subTab);
  }, [location.search]);

  const handleTabChange = (tab: ImageTab) => {
    setActiveTab(tab);
    navigate(`/tools/image-toolkit?tab=${tab}`, { replace: true });
  };

  const handleConvertSubTabChange = (subTab: ConvertSubTab) => {
    setConvertSubTab(subTab);
    navigate(`/tools/image-toolkit?tab=${subTab}`, { replace: true });
  };

  return (
    <div className="space-y-8" id="image-toolkit-workspace">
      {/* Workspace Header & Top Bar */}
      <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700 dark:text-neutral-300">
          <ImageIcon className="w-4 h-4 text-cyan-500" />
          <span>Image Toolkit Workspace</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100/80 dark:bg-black/40 rounded-xl border border-slate-200/60 dark:border-white/5 overflow-x-auto">
          {[
            { id: 'compress', label: 'Compress', icon: Minimize2 },
            { id: 'resize', label: 'Resize Dimensions', icon: Maximize2 },
            { id: 'convert', label: 'Format Converter', icon: Repeat },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as ImageTab)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Convert Sub-Navigation (visible only when Convert is active) */}
      {activeTab === 'convert' && (
        <div className="flex items-center justify-center gap-2 pb-2">
          {[
            { id: 'webp', label: 'WebP & Universal Converter' },
            { id: 'jpg-to-png', label: 'JPG to PNG' },
            { id: 'png-to-jpg', label: 'PNG to JPG' },
          ].map((sub) => {
            const isSubActive = convertSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => handleConvertSubTabChange(sub.id as ConvertSubTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30 shadow-sm font-semibold'
                    : 'glass-button text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Tab Panel */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'compress' && <ImageCompressor />}
        {activeTab === 'resize' && <ImageResizer />}
        {activeTab === 'convert' && (
          <>
            {convertSubTab === 'webp' && <WebpConverter />}
            {convertSubTab === 'jpg-to-png' && <JpgToPng />}
            {convertSubTab === 'png-to-jpg' && <PngToJpg />}
          </>
        )}
      </div>
    </div>
  );
};
