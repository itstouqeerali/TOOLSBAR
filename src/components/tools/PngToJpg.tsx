import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Download, RefreshCw, AlertCircle, 
  CheckCircle2, ShieldCheck, Trash2, Info, ArrowRight, Palette,
  Sliders, Eye, Sparkles, FileImage
} from 'lucide-react';

interface ConversionStats {
  name: string;
  originalSize: number;
  jpgSize: number;
  width: number;
  height: number;
  quality: number;
  bgColor: string;
  hasTransparency: boolean;
}

export const PngToJpg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [hasTransparency, setHasTransparency] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [quality, setQuality] = useState<number>(90);

  // Result state
  const [jpgBlobUrl, setJpgBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<ConversionStats | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (jpgBlobUrl) URL.revokeObjectURL(jpgBlobUrl);
    };
  }, [previewUrl, jpgBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Inspect pixels to check for transparency
  const detectTransparency = (img: HTMLImageElement): boolean => {
    try {
      // Downscale test canvas to 200x200 max for fast and memory-safe sampling
      const sampleW = Math.min(img.naturalWidth, 200);
      const sampleH = Math.min(img.naturalHeight, 200);
      const canvas = document.createElement('canvas');
      canvas.width = sampleW;
      canvas.height = sampleH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return false;

      ctx.drawImage(img, 0, 0, sampleW, sampleH);
      const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
      const data = imgData.data;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 250) {
          return true; // Found transparent or semi-transparent pixel
        }
      }
      return false;
    } catch (e) {
      console.warn('Could not inspect pixel transparency:', e);
      return false;
    }
  };

  const handleIncomingFile = (selectedFile: File) => {
    setErrorMsg(null);
    const isValidPng = selectedFile.type === 'image/png' || /\.png$/i.test(selectedFile.name);

    if (!isValidPng) {
      setErrorMsg('Please select a valid PNG image file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg('File exceeds 50MB safe memory limit for browser processing.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (jpgBlobUrl) {
      URL.revokeObjectURL(jpgBlobUrl);
      setJpgBlobUrl(null);
      setStats(null);
    }

    const newPreview = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 16384 || img.naturalHeight > 16384 || (img.naturalWidth * img.naturalHeight > 40000000)) {
        setErrorMsg(`Image dimensions (${img.naturalWidth}×${img.naturalHeight}) exceed safe browser canvas limits.`);
        URL.revokeObjectURL(newPreview);
        return;
      }

      const isTransparent = detectTransparency(img);
      setHasTransparency(isTransparent);
      setFile(selectedFile);
      setPreviewUrl(newPreview);
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setErrorMsg('Failed to decode PNG image. The file may be corrupt.');
      URL.revokeObjectURL(newPreview);
    };
    img.src = newPreview;
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleIncomingFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleIncomingFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleConvert = async () => {
    if (!file || !dimensions || !previewUrl) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load PNG into memory'));
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context could not be initialized.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Fill solid background color for transparent pixels (JPEG has no alpha channel)
      ctx.fillStyle = bgColor || '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw PNG on top of background
      ctx.drawImage(img, 0, 0);

      // 3. Encode as JPEG with selected quality
      const encodeQuality = quality / 100;
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', encodeQuality);
      });

      if (!blob) {
        throw new Error('JPEG encoding failed to produce output.');
      }

      if (jpgBlobUrl) {
        URL.revokeObjectURL(jpgBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setJpgBlobUrl(newBlobUrl);

      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setStats({
        name: `${baseName}.jpg`,
        originalSize: file.size,
        jpgSize: blob.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        quality,
        bgColor,
        hasTransparency,
      });
    } catch (err: any) {
      console.error('JPEG conversion error:', err);
      setErrorMsg(err.message || 'An error occurred during JPEG conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (jpgBlobUrl) URL.revokeObjectURL(jpgBlobUrl);
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setHasTransparency(false);
    setJpgBlobUrl(null);
    setStats(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8" id="png-to-jpg-tool">
      {/* Privacy Guarantee Card */}
      <div className="rounded-2xl p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span><strong>100% Client-Side Privacy:</strong> Your files are processed locally in your browser and are never uploaded.</span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
          Local Processing
        </span>
      </div>

      {/* Upload Zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl p-8 sm:p-12 border-2 border-dashed transition-all duration-200 text-center cursor-pointer overflow-hidden ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]'
              : 'border-slate-300 dark:border-white/15 bg-white/60 dark:bg-white/[0.02] hover:border-indigo-400 hover:bg-slate-50/80 dark:hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <ImageIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose a PNG image or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Convert PNG graphics to compact JPG photographs with automatic transparency detection and customizable background fills.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Select PNG Image
            </button>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          {/* Active File Card */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="PNG preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {dimensions?.width} × {dimensions?.height} px
                  </span>
                  <span>•</span>
                  <span>Size: <strong>{formatFileSize(file.size)}</strong></span>
                  <span>•</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    hasTransparency 
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300' 
                      : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-300'
                  }`}>
                    {hasTransparency ? 'Transparency Detected' : 'Opaque PNG'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Change Image
              </button>
            </div>
          </div>

          {/* Conversion Settings Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-indigo-500" />
                  JPEG Conversion Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Configure background color replacement and JPEG encoding quality.
                </p>
              </div>
            </div>

            {/* Transparency Background Color Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  Background Fill for Transparent Pixels
                </span>
                <span className="text-[11px] text-slate-500 font-mono">{bgColor}</span>
              </label>

              {hasTransparency && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>
                    JPEG does not support transparency. Transparent areas will be rendered with your selected background color.
                  </span>
                </div>
              )}

              {/* Color Presets + Custom Picker */}
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Black', hex: '#000000' },
                  { name: 'Light Gray', hex: '#F1F5F9' },
                  { name: 'Dark Slate', hex: '#0F172A' },
                  { name: 'Cream', hex: '#FFFBEB' },
                ].map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => setBgColor(color.hex)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      bgColor.toUpperCase() === color.hex.toUpperCase()
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-500/20 text-slate-900 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-neutral-300 hover:border-slate-300'
                    }`}
                  >
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs">
                  <span className="text-slate-600 dark:text-neutral-300">Custom:</span>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>JPEG Encoding Quality</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Smaller File (10%)</span>
                <span>Balanced (80%)</span>
                <span>Maximum Clarity (100%)</span>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Ready to convert <strong>{file.name}</strong> to JPG format.
              </p>
              <button
                disabled={isProcessing}
                onClick={handleConvert}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting to JPG...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Convert to JPG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="rounded-2xl p-4 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center gap-3 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="flex-1">{errorMsg}</p>
          <button 
            onClick={() => setErrorMsg(null)}
            className="p-1 hover:bg-rose-500/20 rounded-lg text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Result Section */}
      {jpgBlobUrl && stats && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Conversion Complete
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {stats.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={jpgBlobUrl}
                download={stats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download JPG
              </a>
              <button
                onClick={() => {
                  if (jpgBlobUrl) URL.revokeObjectURL(jpgBlobUrl);
                  setJpgBlobUrl(null);
                  setStats(null);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Convert Another
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-emerald-500/20">
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Source Size</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatFileSize(stats.originalSize)}</span>
              <span className="text-[10px] text-slate-400 block">PNG format</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Output Size</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatFileSize(stats.jpgSize)}</span>
              <span className="text-[10px] text-slate-400 block">JPG @ {stats.quality}% quality</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Dimensions</span>
              <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {stats.width} × {stats.height}
              </span>
              <span className="text-[10px] text-slate-400 block">Preserved 100%</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Background Fill</span>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20"
                  style={{ backgroundColor: stats.bgColor }}
                />
                <span className="text-xs font-mono text-slate-900 dark:text-white">{stats.bgColor}</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Converted JPG Output Preview</span>
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-96 p-4">
              <img src={jpgBlobUrl} alt="Converted JPG" className="max-h-80 max-w-full object-contain rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
