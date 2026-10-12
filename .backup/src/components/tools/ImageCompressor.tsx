import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Download, RefreshCw, AlertCircle, 
  CheckCircle2, Minimize2, ShieldCheck, Trash2, Info, 
  ArrowDownRight, ArrowUpRight, Gauge, Sliders, Eye, FileImage
} from 'lucide-react';

type CompressionPreset = 'high' | 'balanced' | 'max' | 'custom';
type OutputFormat = 'original' | 'image/jpeg' | 'image/webp' | 'image/png';

interface ProcessedStats {
  name: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  percentage: number;
  isSmaller: boolean;
  originalWidth: number;
  originalHeight: number;
  outputWidth: number;
  outputHeight: number;
  outputFormat: string;
}

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings
  const [preset, setPreset] = useState<CompressionPreset>('balanced');
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original');
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original

  // Result state (100% REAL calculated bytes)
  const [compressedBlobUrl, setCompressedBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  const [viewMode, setViewMode] = useState<'comparison' | 'compressed'>('comparison');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup Object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedBlobUrl) URL.revokeObjectURL(compressedBlobUrl);
    };
  }, [previewUrl, compressedBlobUrl]);

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

    // Check file size safety (e.g. 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg('File exceeds 50MB safe memory limit for browser processing.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedBlobUrl) {
      URL.revokeObjectURL(compressedBlobUrl);
      setCompressedBlobUrl(null);
      setStats(null);
    }

    const newPreview = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.onload = () => {
      // Memory / Dimension safety check
      if (img.naturalWidth > 16384 || img.naturalHeight > 16384 || (img.naturalWidth * img.naturalHeight > 40000000)) {
        setErrorMsg(`Image dimensions (${img.naturalWidth}×${img.naturalHeight}) exceed safe browser canvas limits.`);
        URL.revokeObjectURL(newPreview);
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(newPreview);
      setImageMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: selectedFile.type || 'image/jpeg',
      });

      // If uploaded file is PNG, default format to WebP for genuine lossy compression with alpha transparency
      if (selectedFile.type === 'image/png' || /\.png$/i.test(selectedFile.name)) {
        setOutputFormat('image/webp');
      } else {
        setOutputFormat('original');
      }
    };
    img.onerror = () => {
      setErrorMsg('Failed to decode image file. It may be corrupt or formatted improperly.');
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

  const applyPreset = (newPreset: CompressionPreset) => {
    setPreset(newPreset);
    if (newPreset === 'high') {
      setQuality(78);
      setMaxDimension(0);
    } else if (newPreset === 'balanced') {
      setQuality(60);
      setMaxDimension(0);
    } else if (newPreset === 'max') {
      setQuality(40);
      setMaxDimension(1600);
    }
  };

  const handleCompress = async () => {
    if (!file || !imageMeta || !previewUrl) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for compression'));
        img.src = previewUrl;
      });

      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      // Scale down if maxDimension is set and smaller than current
      if (maxDimension > 0 && (targetWidth > maxDimension || targetHeight > maxDimension)) {
        if (targetWidth >= targetHeight) {
          targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
          targetWidth = maxDimension;
        } else {
          targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
          targetHeight = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { alpha: true });

      if (!ctx) {
        throw new Error('Canvas 2D context could not be initialized.');
      }

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Determine target MIME type
      let targetMime = file.type;
      if (outputFormat !== 'original') {
        targetMime = outputFormat;
      } else if (!targetMime || targetMime === 'application/octet-stream') {
        targetMime = 'image/jpeg';
      }

      // If converting to JPEG, pre-fill background with white to avoid black transparency
      if (targetMime === 'image/jpeg' || targetMime === 'image/jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Encode to Blob
      const compressionQuality = quality / 100;
      const blob = await new Promise<Blob | null>((resolve) => {
        if (targetMime === 'image/png') {
          // PNG is lossless in browser canvas
          canvas.toBlob((b) => resolve(b), 'image/png');
        } else {
          canvas.toBlob((b) => resolve(b), targetMime, compressionQuality);
        }
      });

      if (!blob) {
        throw new Error('Image compression failed to produce output.');
      }

      if (compressedBlobUrl) {
        URL.revokeObjectURL(compressedBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setCompressedBlobUrl(newBlobUrl);

      const originalSize = file.size;
      const compressedSize = blob.size;
      const savedBytes = originalSize - compressedSize;
      const percentage = (savedBytes / originalSize) * 100;
      const isSmaller = savedBytes > 0;

      // Calculate proper file extension
      let ext = '.jpg';
      if (targetMime === 'image/png') ext = '.png';
      else if (targetMime === 'image/webp') ext = '.webp';
      else if (targetMime === 'image/jpeg') ext = '.jpg';

      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const resultFileName = `${baseName}_compressed${ext}`;

      setStats({
        name: resultFileName,
        originalSize,
        compressedSize,
        savedBytes,
        percentage,
        isSmaller,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
        outputWidth: targetWidth,
        outputHeight: targetHeight,
        outputFormat: targetMime,
      });
    } catch (err: any) {
      console.error('Compression failure:', err);
      setErrorMsg(err.message || 'An error occurred while compressing the image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedBlobUrl) URL.revokeObjectURL(compressedBlobUrl);
    setFile(null);
    setPreviewUrl(null);
    setImageMeta(null);
    setCompressedBlobUrl(null);
    setStats(null);
    setErrorMsg(null);
  };

  const isPngOutput = (outputFormat === 'original' && imageMeta?.type === 'image/png') || outputFormat === 'image/png';

  return (
    <div className="space-y-8" id="image-compressor-tool">
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

      {/* Upload Zone (when no file selected) */}
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
              <Minimize2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose an image or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Supports JPG, PNG, and WebP up to 50MB. Real-time in-browser optimization.
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
        /* Workspace when file is loaded */
        <div className="space-y-6">
          {/* Active File Card */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Original thumbnail" className="w-full h-full object-cover" />
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
                    {imageMeta?.width} × {imageMeta?.height} px
                  </span>
                  <span>•</span>
                  <span>Original Size: <strong>{formatFileSize(file.size)}</strong></span>
                  <span>•</span>
                  <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10">
                    {file.type.split('/')[1] || 'IMAGE'}
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

          {/* Compression Configuration Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-indigo-500" />
                  Optimization Controls
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Select a compression preset or fine-tune quality and output format.
                </p>
              </div>
            </div>

            {/* Presets Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => applyPreset('high')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  preset === 'high'
                    ? 'bg-indigo-50/70 dark:bg-indigo-500/15 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                    : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold block mb-1">High Quality</span>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">78% Quality, 100% Dimensions</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('balanced')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  preset === 'balanced'
                    ? 'bg-indigo-50/70 dark:bg-indigo-500/15 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                    : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">Balanced</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                    Best
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">60% Quality, 100% Dimensions</span>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('max')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  preset === 'max'
                    ? 'bg-indigo-50/70 dark:bg-indigo-500/15 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                    : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold block mb-1">Max Compression</span>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">40% Quality, Max 1600px</span>
              </button>

              <button
                type="button"
                onClick={() => setPreset('custom')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  preset === 'custom'
                    ? 'bg-indigo-50/70 dark:bg-indigo-500/15 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                    : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold block mb-1">Custom Settings</span>
                <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">Manual Quality & Format</span>
              </button>
            </div>

            {/* Quality and Format Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Output Format */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>Output Format</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {outputFormat === 'original' ? `Original (${file.type.split('/')[1] || 'IMAGE'})` : outputFormat.split('/')[1].toUpperCase()}
                  </span>
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="original">Keep Original Format</option>
                  <option value="image/webp">Convert to WebP (Superior Compression)</option>
                  <option value="image/jpeg">Convert to JPEG (Standard Photo)</option>
                  <option value="image/png">Convert to PNG (Lossless)</option>
                </select>
              </div>

              {/* Quality Slider (for JPG & WebP) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Image Quality</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  disabled={isPngOutput}
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseInt(e.target.value, 10));
                    setPreset('custom');
                  }}
                  className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer"
                />
                {isPngOutput && (
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                    PNG uses lossless compression. Quality slider is active for JPEG and WebP outputs.
                  </p>
                )}
              </div>
            </div>

            {/* Technical Transparency Note */}
            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-neutral-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Technical Transparency:</strong> All compression is computed natively via browser canvas encoding and exact byte comparison. WebP format typically yields 25% to 35% higher compression than JPEG at equivalent visual quality.
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Ready to compress <strong>{file.name}</strong>.
              </p>
              <button
                disabled={isProcessing}
                onClick={handleCompress}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Image...</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Compress Image</span>
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
      {compressedBlobUrl && stats && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileImage className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {stats.isSmaller ? 'Compression Successful' : 'Processing Complete (Output is larger)'}
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {stats.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={compressedBlobUrl}
                download={stats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Compressed Image
              </a>
              <button
                onClick={() => {
                  if (compressedBlobUrl) URL.revokeObjectURL(compressedBlobUrl);
                  setCompressedBlobUrl(null);
                  setStats(null);
                }}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Compress Another
              </button>
            </div>
          </div>

          {/* Genuine Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-emerald-500/20">
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Original Size</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatFileSize(stats.originalSize)}</span>
              <span className="text-[10px] text-slate-400 block">{stats.originalWidth} × {stats.originalHeight} px</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Compressed Size</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatFileSize(stats.compressedSize)}</span>
              <span className="text-[10px] text-slate-400 block">{stats.outputWidth} × {stats.outputHeight} px</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Size Delta</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1">
                {stats.isSmaller ? (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">-{formatFileSize(stats.savedBytes)}</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">+{formatFileSize(Math.abs(stats.savedBytes))}</span>
                  </>
                )}
              </span>
              <span className="text-[10px] text-slate-400 block">Actual calculated difference</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Percentage Change</span>
              <span className={`text-lg font-bold font-mono ${stats.isSmaller ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {stats.isSmaller ? `-${stats.percentage.toFixed(1)}%` : `+${Math.abs(stats.percentage).toFixed(1)}%`}
              </span>
              <span className="text-[10px] text-slate-400 block">{stats.isSmaller ? 'Saved space' : 'File expanded'}</span>
            </div>
          </div>

          {!stats.isSmaller && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  The output is larger than your original file (+{formatFileSize(Math.abs(stats.savedBytes))}). This occurs when the input was already compressed with high quantization, or when uncompressed 32-bit PNG canvas re-encoding was chosen.
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {outputFormat !== 'image/webp' && (
                  <button
                    onClick={() => {
                      setOutputFormat('image/webp');
                      setQuality(60);
                      setTimeout(handleCompress, 50);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    ⚡ Try WebP format (Recommended)
                  </button>
                )}
                {quality > 60 && (
                  <button
                    onClick={() => {
                      setQuality(50);
                      setTimeout(handleCompress, 50);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold text-[11px] transition-colors cursor-pointer"
                  >
                    ⚡ Try 50% Quality
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Visual Previews */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                Image Preview
              </h4>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl text-xs">
                <button
                  onClick={() => setViewMode('comparison')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    viewMode === 'comparison'
                      ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setViewMode('compressed')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    viewMode === 'compressed'
                      ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
                  }`}
                >
                  Compressed Only
                </button>
              </div>
            </div>

            {viewMode === 'comparison' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-neutral-400">
                    Original ({formatFileSize(stats.originalSize)})
                  </span>
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-72 p-2">
                    {previewUrl && (
                      <img src={previewUrl} alt="Original" className="max-h-64 max-w-full object-contain rounded-lg" />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Compressed ({formatFileSize(stats.compressedSize)})
                  </span>
                  <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-72 p-2">
                    <img src={compressedBlobUrl} alt="Compressed" className="max-h-64 max-w-full object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-96 p-4">
                <img src={compressedBlobUrl} alt="Compressed Full" className="max-h-80 max-w-full object-contain rounded-xl" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
