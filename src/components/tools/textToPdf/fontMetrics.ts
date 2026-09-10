import { FontFamilyOption } from './types';

// Standard font width factors normalized to 1000 units (PDF standard AFM metrics)
// Average character widths relative to font size (in points)
export function measureTextWidthPt(
  text: string,
  family: FontFamilyOption,
  sizePt: number,
  bold: boolean,
  italic: boolean
): number {
  if (!text) return 0;

  // Courier is fixed pitch: exactly 600 units per char (0.6 * sizePt)
  if (family === 'Courier') {
    return text.length * 0.6 * sizePt;
  }

  // Use an offscreen canvas for exact standard browser & PDF metric alignment
  if (typeof document !== 'undefined') {
    const canvas = measureTextWidthPt._canvas || (measureTextWidthPt._canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const weightStr = bold ? 'bold' : 'normal';
      const styleStr = italic ? 'italic' : 'normal';
      const fontName = family === 'TimesRoman' ? '"Times New Roman", Times, serif' : 'Helvetica, Arial, sans-serif';
      ctx.font = `${styleStr} ${weightStr} ${sizePt}px ${fontName}`;
      return ctx.measureText(text).width;
    }
  }

  // Fallback heuristic estimation
  let factor = family === 'TimesRoman' ? 0.48 : 0.52;
  if (bold) factor *= 1.08;
  return text.length * factor * sizePt;
}

measureTextWidthPt._canvas = null as HTMLCanvasElement | null;
