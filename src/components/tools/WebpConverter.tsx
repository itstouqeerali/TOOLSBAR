import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Download, RefreshCw, AlertCircle, 
  CheckCircle2, ShieldCheck, Trash2, Info, ArrowRight, Palette,
  Repeat, Eye, Sparkles, FileImage
} from 'lucide-react';

type SupportedFormat = 'image/webp' | 'image/jpeg' | 'image/png';

interface WebpStats {
  name: string;
  originalSize: number;
  outputSize: number;
  width: number;
  height: number;
  inputFormat: string;
  outputFormat: string;
  savedBytes: number;
  percentage: number;
  isSmaller: boolean;
}

export const WebpConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [detectedFormat, setDetectedFormat] = useState<SupportedFormat>('image/jpeg');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>('image/webp');
  const [quality, setQuality] = useState<number>(85);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [hasTransparency, setHasTransparency] = useState<boolean>(false);

  // Result state
  const [outputBlobUrl, setOutputBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<WebpStats | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (outputBlobUrl) URL.revokeObjectURL(outputBlobUrl);
    };
  }, [previewUrl, outputBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const detectTransparency = (img: HTMLImageElement): boolean => {
    try {
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
        if (data[i] < 250) return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleIncomingFile = (selectedFile: File) => {
    setErrorMsg(null);
    let mime: SupportedFormat = 'image/jpeg';

    if (selectedFile.type === 'image/webp' || /\.webp$/i.test(selectedFile.name)) {
      mime = 'image/webp';
    } else if (selectedFile.type === 'image/png' || /\.png$/i.test(selectedFile.name)) {
      mime = 'image/png';
    } else if (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg' || /\.(jpe?g)$/i.test(selectedFile.name)) {
      mime = 'image/jpeg';
    } else {
      setErrorMsg('Please select a valid image (WebP, JPG, or PNG).');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg('File exceeds 50MB safe memory limit for browser processing.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputBlobUrl) {
      URL.revokeObjectURL(outputBlobUrl);
      setOutputBlobUrl(null);
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
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setDetectedFormat(mime);

      // Default target format recommendation
      if (mime === 'image/webp') {
        setTargetFormat('image/png'); // If WebP input, default to PNG or JPG
      } else {
        setTargetFormat('image/webp'); // If JPG/PNG input, default to WebP
      }

      const isTransparent = detectTransparency(img);
      setHasTransparency(isTransparent);
    };
    img.onerror = () => {
      setErrorMsg('Failed to decode image. File may be corrupted or unsupported by your browser.');
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
        img.onerror = () => reject(new Error('Failed to load image for conversion'));
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

      // Pre-fill background if target format is JPEG to cleanly handle transparent pixels
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = bgColor || '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Verify browser native WebP encoder support
      const encodeQuality = quality / 100;
      const blob = await new Promise<Blob | null>((resolve) => {
        if (targetFormat === 'image/png') {
          canvas.toBlob((b) => resolve(b), 'image/png');
        } else {
          canvas.toBlob((b) => resolve(b), targetFormat, encodeQuality);
        }
      });

      if (!blob) {
        throw new Error(`Your browser could not encode image to ${targetFormat.split('/')[1].toUpperCase()}.`);
      }

      if (outputBlobUrl) {
        URL.revokeObjectURL(outputBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setOutputBlobUrl(newBlobUrl);

      let ext = '.webp';
      if (targetFormat === 'image/jpeg') ext = '.jpg';
      else if (targetFormat === 'image/png') ext = '.png';

      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const savedBytes = file.size - blob.size;
      const percentage = (savedBytes / file.size) * 100;

      setStats({
        name: `${baseName}${ext}`,
        originalSize: file.size,
        outputSize: blob.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
        inputFormat: detectedFormat.split('/')[1].toUpperCase(),
        outputFormat: targetFormat.split('/')[1].toUpperCase(),
        savedBytes,
        percentage,
        isSmaller: savedBytes > 0,
      });
    } catch (err: any) {
      console.error('WebP conversion error:', err);
      setErrorMsg(err.message || 'An error occurred during conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputBlobUrl) URL.revokeObjectURL(outputBlobUrl);
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setOutputBlobUrl(null);
    setStats(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8" id="webp-converter-tool">
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
            accept="image/webp,image/jpeg,image/png,.webp,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose an image or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Convert between JPG, PNG, and next-gen WebP formats seamlessly in browser memory.
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
                  <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-contain" />
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
                  <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                    Detected: {detectedFormat.split('/')[1]}
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

          {/* Converter Settings Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-indigo-500" />
                  Format Conversion Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Select your target output format and encoding options.
                </p>
              </div>
            </div>

            {/* Target Format Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Target Output Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { format: 'image/webp' as SupportedFormat, title: 'WebP (Next-Gen)', desc: 'Optimal web compression with transparency support.' },
                  { format: 'image/jpeg' as SupportedFormat, title: 'JPEG (.jpg)', desc: 'Standard photographic format, high compatibility.' },
                  { format: 'image/png' as SupportedFormat, title: 'PNG (.png)', desc: 'Lossless quality with full transparency support.' },
                ].map((opt) => (
                  <button
                    key={opt.format}
                    type="button"
                    onClick={() => setTargetFormat(opt.format)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      targetFormat === opt.format
                        ? 'bg-indigo-50/70 dark:bg-indigo-500/15 border-indigo-500 text-slate-900 dark:text-white shadow-md'
                        : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold block mb-1">{opt.title}</span>
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400 block">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for WebP and JPEG) */}
            {targetFormat !== 'image/png' && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Encoding Quality</span>
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
              </div>
            )}

            {/* Background Color Picker if converting transparent image to JPEG */}
            {targetFormat === 'image/jpeg' && hasTransparency && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-indigo-500" />
                    Background Fill for Transparency (JPEG only)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{bgColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <span className="text-xs text-slate-600 dark:text-neutral-400">
                    Transparent areas will be rendered on top of this color.
                  </span>
                </div>
              </div>
            )}

            {/* Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Converting from <strong>{detectedFormat.split('/')[1].toUpperCase()}</strong> to <strong>{targetFormat.split('/')[1].toUpperCase()}</strong>.
              </p>
              <button
                disabled={isProcessing}
                onClick={handleConvert}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting Image...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Convert Image</span>
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
      {outputBlobUrl && stats && (
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
                href={outputBlobUrl}
                download={stats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download {stats.outputFormat}
              </a>
              <button
                onClick={() => {
                  if (outputBlobUrl) URL.revokeObjectURL(outputBlobUrl);
                  setOutputBlobUrl(null);
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
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Source ({stats.inputFormat})</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatFileSize(stats.originalSize)}</span>
              <span className="text-[10px] text-slate-400 block">{stats.width} × {stats.height} px</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Output ({stats.outputFormat})</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{formatFileSize(stats.outputSize)}</span>
              <span className="text-[10px] text-slate-400 block">Browser Encoded</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Size Delta</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {stats.isSmaller ? `-${formatFileSize(stats.savedBytes)}` : `+${formatFileSize(Math.abs(stats.savedBytes))}`}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {stats.isSmaller ? `${stats.percentage.toFixed(1)}% reduction` : 'Lossless expansion'}
              </span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Resolution</span>
              <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                100%
              </span>
              <span className="text-[10px] text-slate-400 block">Exact pixel mapping</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Converted Output Preview</span>
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-96 p-4">
              <img src={outputBlobUrl} alt="Converted Output" className="max-h-80 max-w-full object-contain rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
