import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Image as ImageIcon, Download, RefreshCw, AlertCircle, 
  CheckCircle2, ShieldCheck, Trash2, Info, ArrowRight, FileImage
} from 'lucide-react';

interface ConversionStats {
  name: string;
  originalSize: number;
  pngSize: number;
  width: number;
  height: number;
}

export const JpgToPng: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [pngBlobUrl, setPngBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<ConversionStats | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (pngBlobUrl) URL.revokeObjectURL(pngBlobUrl);
    };
  }, [previewUrl, pngBlobUrl]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleIncomingFile = (selectedFile: File) => {
    setErrorMsg(null);
    const isValidJpg = selectedFile.type === 'image/jpeg' || 
      selectedFile.type === 'image/jpg' || 
      /\.(jpe?g)$/i.test(selectedFile.name);

    if (!isValidJpg) {
      setErrorMsg('Please select a valid JPG or JPEG image document.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg('Image exceeds the 50MB safe memory limit for browser processing.');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (pngBlobUrl) {
      URL.revokeObjectURL(pngBlobUrl);
      setPngBlobUrl(null);
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
    };
    img.onerror = () => {
      setErrorMsg('Failed to decode JPEG image. The file may be corrupt.');
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
        img.onerror = () => reject(new Error('Failed to load JPEG image'));
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context could not be initialized.');
      }

      // Draw JPEG pixels
      ctx.drawImage(img, 0, 0);

      // Convert to standard PNG Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      if (!blob) {
        throw new Error('PNG encoding failed to produce output.');
      }

      if (pngBlobUrl) {
        URL.revokeObjectURL(pngBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setPngBlobUrl(newBlobUrl);

      const baseName = file.name.replace(/\.[^/.]+$/, '');
      setStats({
        name: `${baseName}.png`,
        originalSize: file.size,
        pngSize: blob.size,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    } catch (err: any) {
      console.error('PNG conversion error:', err);
      setErrorMsg(err.message || 'An error occurred during PNG conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (pngBlobUrl) URL.revokeObjectURL(pngBlobUrl);
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setPngBlobUrl(null);
    setStats(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8" id="jpg-to-png-tool">
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
            accept="image/jpeg,image/jpg,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <ImageIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose a JPG / JPEG image or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Convert lossy JPEG files to lossless PNG format in your browser with full resolution preservation.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Select JPG Image
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
                  <img src={previewUrl} alt="JPG preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {file.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {dimensions?.width} × {dimensions?.height} px
                  </span>
                  <span>•</span>
                  <span>Size: <strong>{formatFileSize(file.size)}</strong></span>
                  <span>•</span>
                  <span className="uppercase text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                    JPG Input
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

          {/* Action Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-indigo-500" />
                  Convert to PNG
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Target output format: <strong>PNG (Portable Network Graphics)</strong>
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-neutral-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Format Details:</strong> PNG is a lossless format. Converting from JPG to PNG prevents further generational loss if you plan to edit or crop the image in graphical software. Dimensions are preserved identically.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Ready to convert <strong>{file.name}</strong> ({dimensions?.width}×{dimensions?.height} px).
              </p>
              <button
                disabled={isProcessing}
                onClick={handleConvert}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting to PNG...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>Convert to PNG</span>
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
      {pngBlobUrl && stats && (
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
                href={pngBlobUrl}
                download={stats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </a>
              <button
                onClick={() => {
                  if (pngBlobUrl) URL.revokeObjectURL(pngBlobUrl);
                  setPngBlobUrl(null);
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
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Source Format</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">JPEG</span>
              <span className="text-[10px] text-slate-400 block">{formatFileSize(stats.originalSize)}</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Target Format</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">PNG (Lossless)</span>
              <span className="text-[10px] text-slate-400 block">{formatFileSize(stats.pngSize)}</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Dimensions</span>
              <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {stats.width} × {stats.height}
              </span>
              <span className="text-[10px] text-slate-400 block">Preserved 100%</span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Status</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                Ready
              </span>
              <span className="text-[10px] text-slate-400 block">Browser Decoded</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Converted PNG Preview</span>
            <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/5 dark:bg-black/40 overflow-hidden flex items-center justify-center max-h-96 p-4">
              <img src={pngBlobUrl} alt="Converted PNG" className="max-h-80 max-w-full object-contain rounded-xl shadow-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
