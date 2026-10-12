import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { FontFamilyOption, PaginatedDoc } from './types';

// Convert hex '#rrggbb' to { r, g, b } (0..1)
export function hexToRgb(hexStr: string): { r: number; g: number; b: number } {
  if (!hexStr || hexStr === 'transparent') {
    return { r: 0, g: 0, b: 0 };
  }
  let clean = hexStr.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b,
  };
}

// Clean text for PDF Standard 14 Fonts (WinAnsi encoding compatibility)
export function sanitizeForStandardPdfFont(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/\u2014/g, '--') // em-dash
    .replace(/\u2013/g, '-') // en-dash
    .replace(/\u2026/g, '...') // ellipsis
    .replace(/[\u00A0\u2000-\u200B]/g, ' ') // non-breaking and thin spaces
    .replace(/[^\x00-\x7F\xA0-\xFF]/g, '?'); // replace any unmappable unicode
}

export async function generatePdfBlob(
  paginatedDoc: PaginatedDoc,
  headerTitle: string = '',
  footerText: string = '',
  includePageNumbers: boolean = true
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  // Embed standard PDF 14 fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const helveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const timesBoldItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);

  const courier = await pdfDoc.embedFont(StandardFonts.Courier);
  const courierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const courierOblique = await pdfDoc.embedFont(StandardFonts.CourierOblique);
  const courierBoldOblique = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);

  function getFont(family: FontFamilyOption, bold: boolean, italic: boolean): PDFFont {
    if (family === 'TimesRoman') {
      if (bold && italic) return timesBoldItalic;
      if (bold) return timesBold;
      if (italic) return timesItalic;
      return times;
    }
    if (family === 'Courier') {
      if (bold && italic) return courierBoldOblique;
      if (bold) return courierBold;
      if (italic) return courierOblique;
      return courier;
    }
    // Default Helvetica
    if (bold && italic) return helveticaBoldOblique;
    if (bold) return helveticaBold;
    if (italic) return helveticaOblique;
    return helvetica;
  }

  const { pageWidthPt, pageHeightPt, marginPt, contentWidthPt, topMarginPt, bottomMarginPt } = paginatedDoc.dimensions;
  const totalPages = paginatedDoc.pages.length;

  for (let pIdx = 0; pIdx < totalPages; pIdx++) {
    const pageData = paginatedDoc.pages[pIdx];
    const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);

    // Running Header
    if (headerTitle.trim()) {
      const headerFont = helvetica;
      const cleanHeader = sanitizeForStandardPdfFont(headerTitle.trim());
      const headerY = pageHeightPt - marginPt + 8;
      page.drawText(cleanHeader, {
        x: marginPt,
        y: headerY,
        size: 8.5,
        font: headerFont,
        color: rgb(0.45, 0.5, 0.58),
      });

      // Subtle header rule
      page.drawLine({
        start: { x: marginPt, y: pageHeightPt - marginPt - 4 },
        end: { x: pageWidthPt - marginPt, y: pageHeightPt - marginPt - 4 },
        thickness: 0.5,
        color: rgb(0.85, 0.88, 0.92),
      });
    }

    // Running Footer & Page Numbers
    if (footerText.trim() || includePageNumbers) {
      const footerFont = helvetica;
      const footerY = marginPt - 16;

      // Subtle footer rule
      page.drawLine({
        start: { x: marginPt, y: marginPt - 4 },
        end: { x: pageWidthPt - marginPt, y: marginPt - 4 },
        thickness: 0.5,
        color: rgb(0.85, 0.88, 0.92),
      });

      if (footerText.trim()) {
        const cleanFooter = sanitizeForStandardPdfFont(footerText.trim());
        page.drawText(cleanFooter, {
          x: marginPt,
          y: footerY,
          size: 8.5,
          font: footerFont,
          color: rgb(0.45, 0.5, 0.58),
        });
      }

      if (includePageNumbers) {
        const pageNumStr = `Page ${pageData.pageNumber} of ${totalPages}`;
        const numWidth = footerFont.widthOfTextAtSize(pageNumStr, 8.5);
        page.drawText(pageNumStr, {
          x: pageWidthPt - marginPt - numWidth,
          y: footerY,
          size: 8.5,
          font: footerFont,
          color: rgb(0.45, 0.5, 0.58),
        });
      }
    }

    // Body content: in pdf-lib, y starts from bottom
    // Top of content area in PDF coordinates:
    let currentY = pageHeightPt - topMarginPt;

    for (const slice of pageData.blockSlices) {
      if (slice.type === 'hr') {
        currentY -= 8;
        page.drawLine({
          start: { x: marginPt, y: currentY },
          end: { x: pageWidthPt - marginPt, y: currentY },
          thickness: 0.75,
          color: rgb(0.8, 0.84, 0.9),
        });
        currentY -= 8;
        continue;
      }

      const isList = slice.type === 'bullet' || slice.type === 'number';
      const listIndent = isList ? 18 : 0;

      for (let lIdx = 0; lIdx < slice.lines.length; lIdx++) {
        const line = slice.lines[lIdx];
        const lineH = line.lineHeightPt;

        // Baseline is roughly 75% down the line height
        const baselineY = currentY - lineH * 0.78;

        let startX = marginPt + listIndent;
        if (slice.align === 'center') {
          startX = marginPt + (contentWidthPt - line.lineWidthPt) / 2;
        } else if (slice.align === 'right') {
          startX = pageWidthPt - marginPt - line.lineWidthPt;
        }

        // Draw list marker if first line of list item
        if (line.listMarker && line.isFirstLineOfBlock) {
          const markerFont = helveticaBold;
          page.drawText(line.listMarker, {
            x: marginPt + 2,
            y: baselineY,
            size: 11,
            font: markerFont,
            color: rgb(0.2, 0.25, 0.35),
          });
        }

        let currX = startX;

        for (const span of line.spans) {
          if (!span.text) continue;

          const cleanStr = sanitizeForStandardPdfFont(span.text);
          const font = getFont(span.fontFamily, span.bold, span.italic);
          const fontSize = span.fontSizePt || 12;

          // Measure actual width with PDF font
          const spanWidth = font.widthOfTextAtSize(cleanStr, fontSize);

          // Draw highlight background rectangle if highlight is set
          if (span.bgColorHex && span.bgColorHex !== 'transparent') {
            const bgRgb = hexToRgb(span.bgColorHex);
            page.drawRectangle({
              x: currX - 1,
              y: baselineY - 2,
              width: spanWidth + 2,
              height: fontSize + 3,
              color: rgb(bgRgb.r, bgRgb.g, bgRgb.b),
            });
          }

          // Draw text
          const textRgb = hexToRgb(span.colorHex || '#0f172a');
          page.drawText(cleanStr, {
            x: currX,
            y: baselineY,
            size: fontSize,
            font,
            color: rgb(textRgb.r, textRgb.g, textRgb.b),
          });

          // Underline
          if (span.underline) {
            page.drawLine({
              start: { x: currX, y: baselineY - 1.5 },
              end: { x: currX + spanWidth, y: baselineY - 1.5 },
              thickness: Math.max(0.7, fontSize / 16),
              color: rgb(textRgb.r, textRgb.g, textRgb.b),
            });
          }

          // Strikethrough
          if (span.strikethrough) {
            page.drawLine({
              start: { x: currX, y: baselineY + fontSize * 0.35 },
              end: { x: currX + spanWidth, y: baselineY + fontSize * 0.35 },
              thickness: Math.max(0.7, fontSize / 16),
              color: rgb(textRgb.r, textRgb.g, textRgb.b),
            });
          }

          currX += spanWidth;
        }

        currentY -= lineH;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
