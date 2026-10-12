import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Download, RefreshCw, AlertCircle, 
  CheckCircle2, Maximize2, ShieldCheck, Trash2, Info, 
  Lock, Unlock, Sparkles, Sliders, Layers, FileImage
} from 'lucide-react';

type OutputFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';

interface ResizedStats {
  name: string;
  originalSize: number;
  resizedSize: number;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  format: string;
}

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Resize Controls
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState<number>(90);

  // Result state
  const [resizedBlobUrl, setResizedBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<ResizedStats | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resizedBlobUrl) URL.revokeObjectURL(resizedBlobUrl);
    };
  }, [previewUrl, resizedBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleIncomingFile = (selectedFile: File) => {
    setErrorMsg(null);
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isValidType = validMimes.includes(selectedFile.type.toLowerCase()) || 
      /\.(jpe?g|png|webp)$/i.test(selectedFile.name);

    if (!isValidType) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg('File exceeds 50MB safe memory limit for browser resizing.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resizedBlobUrl) {
      URL.revokeObjectURL(resizedBlobUrl);
      setResizedBlobUrl(null);
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

      setFile(selectedFile);
      setPreviewUrl(newPreview);
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    };
    img.onerror = () => {
      setErrorMsg('Failed to decode image. File may be corrupted or invalid.');
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

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspectRatio && aspectRatio > 0 && val > 0) {
      setHeight(Math.max(1, Math.round(val / aspectRatio)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspectRatio && aspectRatio > 0 && val > 0) {
      setWidth(Math.max(1, Math.round(val * aspectRatio)));
    }
  };

  const scaleByPercent = (percent: number) => {
    if (!originalDimensions) return;
    const newW = Math.max(1, Math.round((originalDimensions.width * percent) / 100));
    const newH = Math.max(1, Math.round((originalDimensions.height * percent) / 100));
    setWidth(newW);
    setHeight(newH);
  };

  const setPresetDimensions = (targetW: number, targetH: number) => {
    setWidth(targetW);
    setHeight(targetH);
  };

  const handleResize = async () => {
    if (!file || !originalDimensions || !previewUrl) return;

    if (width <= 0 || height <= 0) {
      setErrorMsg('Width and Height must be positive numbers greater than 0.');
      return;
    }

    if (width > 16384 || height > 16384 || (width * height > 40000000)) {
      setErrorMsg(`Target dimensions (${width}×${height} px) exceed safe browser memory limits (max 16,384px or 40MP).`);
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image into memory'));
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context could not be initialized.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Determine target MIME type
      let targetMime = file.type;
      if (outputFormat !== 'original') {
        targetMime = outputFormat;
      } else if (!targetMime || targetMime === 'application/octet-stream') {
        targetMime = 'image/jpeg';
      }

      // Pre-fill background if converting to JPEG to prevent black transparent artifacts
      if (targetMime === 'image/jpeg' || targetMime === 'image/jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      const encodeQuality = quality / 100;
      const blob = await new Promise<Blob | null>((resolve) => {
        if (targetMime === 'image/png') {
          canvas.toBlob((b) => resolve(b), 'image/png');
        } else {
          canvas.toBlob((b) => resolve(b), targetMime, encodeQuality);
        }
      });

      if (!blob) {
        throw new Error('Image resizing failed to generate output.');
      }

      if (resizedBlobUrl) {
        URL.revokeObjectURL(resizedBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setResizedBlobUrl(newBlobUrl);

      let ext = '.jpg';
      if (targetMime === 'image/png') ext = '.png';
      else if (targetMime === 'image/webp') ext = '.webp';
      else if (targetMime === 'image/jpeg') ext = '.jpg';

      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const resultName = `${baseName}_${width}x${height}${ext}`;

      setStats({
        name: resultName,
        originalSize: file.size,
        resizedSize: blob.size,
        originalWidth: originalDimensions.width,
        originalHeight: originalDimensions.height,
        outputWidth: width,
        outputHeight: height,
        format: targetMime,
      });
    } catch (err: any) {
      console.error('Resize failure:', err);
      setErrorMsg(err.message || 'An error occurred while resizing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resizedBlobUrl) URL.revokeObjectURL(resizedBlobUrl);
    setFile(null);
    setPreviewUrl(null);
    setOriginalDimensions(null);
    setWidth(0);
    setHeight(0);
    setResizedBlobUrl(null);
    setStats(null);
    setErrorMsg(null);
  };

  const isPng = (outputFormat === 'original' && file?.type === 'image/png') || outputFormat === 'image/png';

  return (
    <div className="space-y-8" id="image-resizer-tool">
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
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <Maximize2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose an image or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Resize pixels, scale percentages, lock aspect ratio, and convert formats with high-quality bicubic interpolation.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Select Image File
            </button>
          </div>
        </div>
      ) : (
        /* Workspace */
        <div className="space-y-6">
          {/* Active File Card */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
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
                    Original: {originalDimensions?.width} × {originalDimensions?.height} px
                  </span>
                  <span>•</span>
                  <span>Size: <strong>{formatFileSize(file.size)}</strong></span>
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

          {/* Dimension Controls */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Maximize2 className="w-5 h-5 text-indigo-500" />
                  Resize Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Input custom pixel dimensions, select percentage scaling, or pick standard presets.
                </p>
              </div>
            </div>

            {/* Scale Percentages Shortcuts */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Quick Scaling Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[25, 50, 75, 100, 150, 200].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => scaleByPercent(pct)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pixel Inputs with Lock */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Width */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="16384"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Aspect Ratio Lock Toggle */}
              <div className="sm:col-span-2 flex flex-col items-center justify-center pt-5">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  title={lockAspectRatio ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
                    lockAspectRatio
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <span className="text-[10px] text-slate-500 mt-1 font-medium">
                  {lockAspectRatio ? 'Locked' : 'Unlocked'}
                </span>
              </div>

              {/* Height */}
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="16384"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Standard Aspect Presets */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Standard Dimension Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Full HD (1080p)', w: 1920, h: 1080 },
                  { label: 'HD (720p)', w: 1280, h: 720 },
                  { label: 'Instagram Square', w: 1080, h: 1080 },
                  { label: 'Social Banner (OG)', w: 1200, h: 630 },
                  { label: 'Web Medium', w: 800, h: 600 },
                  { label: 'Avatar / Icon', w: 400, h: 400 },
                  { label: 'Email Header', w: 600, h: 300 },
                  { label: 'Thumbnail', w: 320, h: 240 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setLockAspectRatio(false);
                      setPresetDimensions(preset.w, preset.h);
                    }}
                    className="p-2.5 rounded-xl text-left bg-slate-50 dark:bg-white/[0.02] hover:bg-indigo-50/50 dark:hover:bg-indigo-500/15 border border-slate-200 dark:border-white/10 hover:border-indigo-400 text-xs transition-colors cursor-pointer"
                  >
                    <span className="font-semibold block text-slate-900 dark:text-white text-[11px]">{preset.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{preset.w} × {preset.h} px</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Output Format & Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="original">Same as Original ({file.type.split('/')[1] || 'IMAGE'})</option>
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Quality (JPEG / WebP)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  disabled={isPng}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer"
                />
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Target dimensions: <strong>{width} × {height} px</strong>
              </p>
              <button
                disabled={isProcessing}
                onClick={handleResize}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Resizing Image...</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span>Resize Image</span>
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

      {/* Result Card */}
      {resizedBlobUrl && stats && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Resize Complete
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {stats.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={resizedBlobUrl}
                download={stats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Resized Image
              </a>
              <button
                onClick={() => {
                  if (resizedBlobUrl) URL.revokeObjectURL(resizedBlobUrl);
                  setResizedBlobUrl(null);
                  setStats(null);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Resize Another
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-emerald-500/20">
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Original Size</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatFileSize(stats.originalSize)}</span>
              <span className="text-[10px] text-slate-400 block">{stats.originalWidth} × {stats.originalHeight} px</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">New Size</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatFileSize(stats.resizedSize)}</span>
              <span className="text-[10px] text-slate-400 block">{stats.outputWidth} × {stats.outputHeight} px</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Scaling Factor</span>
              <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {((stats.outputWidth / stats.originalWidth) * 100).toFixed(0)}%
              </span>
              <span className="text-[10px] text-slate-400 block">Relative to source</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Format</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white uppercase">
                {stats.format.split('/')[1] || 'IMAGE'}
              </span>
              <span className="text-[10px] text-slate-400 block">Output encoding</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Resized Output Preview</span>
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-96 p-4">
              <img src={resizedBlobUrl} alt="Resized" className="max-h-80 max-w-full object-contain rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
