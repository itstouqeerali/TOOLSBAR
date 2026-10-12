import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, FileImage, Download, RefreshCw, AlertCircle, 
  CheckCircle2, ShieldCheck, Trash2, ArrowUp, ArrowDown, 
  Plus, Settings, Sliders, FileText, Eye, Check, Sparkles
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export interface ImageQueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  width: number;
  height: number;
}

export type PageSizeOption = 'a4' | 'letter' | 'fit';
export type PageOrientationOption = 'auto' | 'portrait' | 'landscape';
export type MarginOption = 'none' | 'small' | 'large';
export type ImageQualityOption = 'high' | 'medium' | 'low';

export const ImagesToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<PageOrientationOption>('auto');
  const [margin, setMargin] = useState<MarginOption>('small');
  const [quality, setQuality] = useState<ImageQualityOption>('high');

  // Output Result
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfStats, setPdfStats] = useState<{
    name: string;
    size: number;
    totalPages: number;
    totalInputSize: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Revoke Blob URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const validFiles: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const isValid = file.type.startsWith('image/') || 
        /\.(jpe?g|png|webp|gif|bmp|svg|tiff?)$/i.test(file.name);
      
      if (isValid) {
        if (file.size > 50 * 1024 * 1024) {
          setErrorMsg(`Skipped "${file.name}" because it exceeds the 50MB per-image limit.`);
        } else {
          validFiles.push(file);
        }
      } else {
        setErrorMsg(`Skipped non-image file "${file.name}". Please upload JPG, PNG, or WebP images.`);
      }
    }

    if (validFiles.length === 0) return;

    setIsProcessing(true);
    setProgressMsg('Loading and analyzing image dimensions...');

    const newItems: ImageQueueItem[] = [];

    for (const file of validFiles) {
      try {
        const previewUrl = URL.createObjectURL(file);
        const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => reject(new Error(`Failed to decode image: ${file.name}`));
          img.src = previewUrl;
        });

        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'image/jpeg',
          previewUrl,
          width: dimensions.width,
          height: dimensions.height,
        });
      } catch (err: any) {
        console.error('Error loading image item:', err);
        setErrorMsg(`Could not process "${file.name}".`);
      }
    }

    setImages(prev => [...prev, ...newItems]);
    setIsProcessing(false);
    setProgressMsg('');

    // Clear previous generated PDF when images change
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
      setPdfStats(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeImage = (id: string) => {
    const item = images.find(img => img.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    setImages(prev => prev.filter(img => img.id !== id));

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
      setPdfStats(null);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    setImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[newIndex];
      copy[newIndex] = temp;
      return copy;
    });

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
      setPdfStats(null);
    }
  };

  const handleReset = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setImages([]);
    setPdfBlobUrl(null);
    setPdfStats(null);
    setErrorMsg(null);
  };

  // Convert an image element to high-quality JPEG binary Uint8Array via offscreen canvas
  const getImageJpegBytes = async (imgItem: ImageQueueItem, qualityValue: number): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const maxDim = 4096; // Guard against giant dimension canvas memory issues
          let targetW = img.naturalWidth;
          let targetH = img.naturalHeight;

          if (targetW > maxDim || targetH > maxDim) {
            if (targetW > targetH) {
              targetH = Math.round((targetH * maxDim) / targetW);
              targetW = maxDim;
            } else {
              targetW = Math.round((targetW * maxDim) / targetH);
              targetH = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Canvas 2D context creation failed'));
            return;
          }

          // Fill white backdrop for transparency handling (PNG/WebP)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.drawImage(img, 0, 0, targetW, targetH);

          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                reject(new Error('Failed to encode image to JPEG'));
                return;
              }
              const buffer = await blob.arrayBuffer();
              resolve(new Uint8Array(buffer));
            },
            'image/jpeg',
            qualityValue
          );
        } catch (e) {
          reject(e);
        }
      };

      img.onerror = () => reject(new Error(`Failed to load image: ${imgItem.name}`));
      img.src = imgItem.previewUrl;
    });
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) {
      setErrorMsg('Please select at least one image to create a PDF.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressMsg('Initializing PDF document...');

    try {
      const pdfDoc = await PDFDocument.create();

      // Quality compression setting
      const qualityFactor = quality === 'high' ? 0.92 : quality === 'medium' ? 0.78 : 0.60;

      // Margin in PDF points (72 points = 1 inch)
      const marginPoints = margin === 'none' ? 0 : margin === 'small' ? 18 : 36;

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgressMsg(`Processing and rendering image ${i + 1} of ${images.length}: ${item.name}...`);

        const jpegBytes = await getImageJpegBytes(item, qualityFactor);
        const embeddedImage = await pdfDoc.embedJpg(jpegBytes);

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;
        const imgAspect = imgWidth / imgHeight;

        let pageWidth = 595.28; // A4 default
        let pageHeight = 841.89;

        if (pageSize === 'fit') {
          // Page fits exact image dimensions
          // Standardize to points
          const scale = Math.min(1, 1200 / Math.max(imgWidth, imgHeight));
          pageWidth = (imgWidth * scale) + (marginPoints * 2);
          pageHeight = (imgHeight * scale) + (marginPoints * 2);
        } else if (pageSize === 'letter') {
          // US Letter: 612 x 792 pt
          let isLandscape = false;
          if (orientation === 'landscape') {
            isLandscape = true;
          } else if (orientation === 'auto') {
            isLandscape = imgAspect > 1.05;
          }

          pageWidth = isLandscape ? 792 : 612;
          pageHeight = isLandscape ? 612 : 792;
        } else {
          // A4: 595.28 x 841.89 pt
          let isLandscape = false;
          if (orientation === 'landscape') {
            isLandscape = true;
          } else if (orientation === 'auto') {
            isLandscape = imgAspect > 1.05;
          }

          pageWidth = isLandscape ? 841.89 : 595.28;
          pageHeight = isLandscape ? 595.28 : 841.89;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate maximum available canvas area for the image
        const availableW = Math.max(10, pageWidth - (marginPoints * 2));
        const availableH = Math.max(10, pageHeight - (marginPoints * 2));

        let drawW = availableW;
        let drawH = drawW / imgAspect;

        if (drawH > availableH) {
          drawH = availableH;
          drawW = drawH * imgAspect;
        }

        // Center the image within the available area
        const posX = marginPoints + (availableW - drawW) / 2;
        const posY = marginPoints + (availableH - drawH) / 2;

        page.drawImage(embeddedImage, {
          x: posX,
          y: posY,
          width: drawW,
          height: drawH,
        });
      }

      setProgressMsg('Building final PDF document binary...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }

      const newBlobUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(newBlobUrl);

      const totalSize = images.reduce((acc, img) => acc + img.size, 0);
      setPdfStats({
        name: `images_to_pdf_${images.length}_pages.pdf`,
        size: blob.size,
        totalPages: images.length,
        totalInputSize: totalSize,
      });
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setErrorMsg(err.message || 'An error occurred while creating the PDF. Please check your images.');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const totalInputSize = images.reduce((acc, img) => acc + img.size, 0);

  return (
    <div className="space-y-8" id="images-to-pdf-tool">
      {/* Privacy Guarantee Banner */}
      <div className="rounded-2xl p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span><strong>100% Client-Side Privacy:</strong> Images are converted and assembled directly in your browser. No files are uploaded to any server.</span>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
          Local Conversion
        </span>
      </div>

      {/* Main Upload Dropzone (When Empty) */}
      {images.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl p-8 sm:p-14 border-2 border-dashed transition-all duration-200 text-center cursor-pointer overflow-hidden ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[0.99]'
              : 'border-slate-300 dark:border-white/15 bg-white/60 dark:bg-white/[0.02] hover:border-indigo-400 hover:bg-slate-50/80 dark:hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp,.gif,.bmp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-md">
              <FileImage className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Choose images or drag & drop here
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Supports JPG, JPEG, PNG, and WebP photos. Select multiple images to combine into a multi-page PDF.
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Browse Images
            </button>
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

      {/* Active Images Workspace */}
      {images.length > 0 && (
        <div className="space-y-6">
          {/* Settings Bar */}
          <div className="rounded-3xl p-6 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/[0.06]">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" /> PDF Document Settings
              </span>
              <span className="text-xs text-slate-500 dark:text-neutral-400">
                {images.length} {images.length === 1 ? 'image' : 'images'} selected ({formatFileSize(totalInputSize)})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {/* Page Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                  Page Format
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSizeOption)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="a4">A4 (Standard 210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image Dimensions</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                  Page Orientation
                </label>
                <select
                  value={orientation}
                  disabled={pageSize === 'fit'}
                  onChange={(e) => setOrientation(e.target.value as PageOrientationOption)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="auto">Auto (Match Image Ratio)</option>
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                </select>
              </div>

              {/* Margins */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                  Page Margins
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as MarginOption)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="none">No Margin (Full Bleed)</option>
                  <option value="small">Small Margin (0.25 in)</option>
                  <option value="large">Standard Margin (0.5 in)</option>
                </select>
              </div>

              {/* Image Quality */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300 block">
                  Image Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as ImageQualityOption)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="high">High Quality (Crisp Photos)</option>
                  <option value="medium">Balanced (Standard Size)</option>
                  <option value="low">Max Compression (Smallest PDF)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Queue & Reordering List */}
          <div className="rounded-3xl p-6 sm:p-8 bg-white/80 dark:bg-white/[0.025] border border-slate-200/90 dark:border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
              <div className="space-y-1">
                <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-indigo-500" />
                  PDF Page Sequence ({images.length} Pages)
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Each image will be rendered on its own PDF page in the exact order shown below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={addMoreInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp,.gif,.bmp"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => addMoreInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add More Images
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200 dark:border-rose-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Images Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Page Number Badge */}
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>

                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-white/10">
                      <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono">{item.width} × {item.height}</span>
                        <span>•</span>
                        <span>{formatFileSize(item.size)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Reorder and Delete Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, 'up')}
                      aria-label="Move Up"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, 'down')}
                      aria-label="Move Down"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeImage(item.id)}
                      aria-label="Remove Image"
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create PDF Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-neutral-400 text-center sm:text-left">
                Ready to generate <strong>{images.length} page</strong> PDF ({pageSize.toUpperCase()}, {margin === 'none' ? '0 margin' : margin + ' margin'}).
              </div>

              <button
                disabled={images.length === 0 || isProcessing}
                onClick={handleGeneratePdf}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-white/10 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{progressMsg || 'Generating PDF...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create PDF ({images.length} {images.length === 1 ? 'Page' : 'Pages'})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Section */}
      {pdfBlobUrl && pdfStats && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-500/10 via-indigo-500/5 to-transparent border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  PDF Generated Successfully
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  {pdfStats.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={pdfBlobUrl}
                download={pdfStats.name}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
              <a
                href={pdfBlobUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-emerald-500/20">
            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Total PDF Pages</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {pdfStats.totalPages} {pdfStats.totalPages === 1 ? 'Page' : 'Pages'}
              </span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">PDF File Size</span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatFileSize(pdfStats.size)}
              </span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Images Combined</span>
              <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {images.length} Photos
              </span>
            </div>

            <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-1">Format / Margins</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {pageSize.toUpperCase()} • {margin}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
