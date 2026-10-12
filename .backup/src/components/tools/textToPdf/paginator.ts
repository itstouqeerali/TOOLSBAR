import {
  CanonicalDocument,
  DocumentDimensions,
  FontFamilyOption,
  FormattedBlock,
  InlineSpan,
  MarginOption,
  PageBlockSlice,
  PageLine,
  PageOrientationOption,
  PageSizeOption,
  PaginatedDoc,
  PaginatedPage,
} from './types';
import { measureTextWidthPt } from './fontMetrics';

export function calculateDimensions(
  pageSize: PageSizeOption,
  orientation: PageOrientationOption,
  margin: MarginOption,
  headerTitle: string,
  footerText: string,
  includePageNumbers: boolean
): DocumentDimensions {
  let w = 595.28;
  let h = 841.89;

  if (pageSize === 'letter') {
    w = 612.0;
    h = 792.0;
  } else if (pageSize === 'legal') {
    w = 612.0;
    h = 1008.0;
  }

  if (orientation === 'landscape') {
    const temp = w;
    w = h;
    h = temp;
  }

  let marginPt = 54.0; // standard 0.75 in
  if (margin === 'compact') {
    marginPt = 36.0; // 0.5 in
  } else if (margin === 'wide') {
    marginPt = 72.0; // 1.0 in
  }

  const headerHeightPt = headerTitle.trim() ? 28.0 : 0;
  const footerHeightPt = footerText.trim() || includePageNumbers ? 28.0 : 0;

  // Safe bottom cushion to guarantee body text never touches bottom margin/footer
  const bottomSafetyBufferPt = 16.0;

  const topMarginPt = marginPt + headerHeightPt;
  const bottomMarginPt = marginPt + footerHeightPt;

  const contentWidthPt = Math.max(100, w - marginPt * 2);
  const contentHeightPt = Math.max(100, h - topMarginPt - bottomMarginPt - bottomSafetyBufferPt);

  return {
    pageWidthPt: w,
    pageHeightPt: h,
    marginPt,
    topMarginPt,
    bottomMarginPt,
    contentWidthPt,
    contentHeightPt,
    headerHeightPt,
    footerHeightPt,
    aspectRatio: w / h,
  };
}

export function paginateDocument(
  doc: CanonicalDocument,
  dimensions: DocumentDimensions,
  lineSpacing: number = 1.4,
  defaultFontSize: number = 12,
  defaultFontFamily: FontFamilyOption = 'Helvetica'
): PaginatedDoc {
  const { contentWidthPt, contentHeightPt } = dimensions;

  const pages: PaginatedPage[] = [];
  let currentPageIndex = 0;
  let currentPageHeight = 0;
  let currentPageSlices: PageBlockSlice[] = [];
  let currentFirstBlockPos: number | undefined = undefined;

  const startNewPage = (nextBlockPos?: number) => {
    pages.push({
      pageIndex: currentPageIndex,
      pageNumber: currentPageIndex + 1,
      firstBlockPos: currentFirstBlockPos,
      usedHeightPt: currentPageHeight,
      blockSlices: currentPageSlices,
    });
    currentPageIndex++;
    currentPageHeight = 0;
    currentPageSlices = [];
    currentFirstBlockPos = nextBlockPos;
  };

  let listCounter = 1;

  for (let bIdx = 0; bIdx < doc.blocks.length; bIdx++) {
    const block = doc.blocks[bIdx];

    if (currentFirstBlockPos === undefined && block.pos !== undefined) {
      currentFirstBlockPos = block.pos;
    }

    // Reset numbered list counter if block is not a numbered list
    if (block.type === 'number') {
      block.listIndex = listCounter++;
    } else {
      listCounter = 1;
    }

    // Explicit Page Break
    if (block.type === 'page-break') {
      const nextPos = doc.blocks[bIdx + 1]?.pos ?? (block.pos !== undefined ? block.pos + 1 : undefined);
      startNewPage(nextPos);
      continue;
    }

    // Horizontal Rule
    if (block.type === 'hr') {
      const hrHeight = 16;
      if (currentPageHeight + hrHeight > contentHeightPt && currentPageSlices.length > 0) {
        startNewPage(block.pos);
      }
      currentPageSlices.push({
        blockId: block.id,
        type: 'hr',
        align: 'left',
        lines: [],
      });
      currentPageHeight += hrHeight;
      continue;
    }

    // List indentation calculation
    const isList = block.type === 'bullet' || block.type === 'number';
    const listIndentPt = isList ? 18 : 0;
    const effectiveWidth = Math.max(50, contentWidthPt - listIndentPt);

    // Spacing above headings
    const spacingAbove =
      block.type === 'h1' ? 16 : block.type === 'h2' ? 12 : block.type === 'h3' ? 8 : 4;
    const spacingBelow =
      block.type === 'h1' ? 8 : block.type === 'h2' ? 6 : block.type === 'h3' ? 4 : 4;

    // Break block spans into wrapped words
    interface WordItem {
      word: string;
      span: InlineSpan;
      widthPt: number;
      spaceWidthPt: number;
    }

    const wordsWithStyle: WordItem[] = [];

    for (const span of block.spans) {
      const parts = span.text.split('\n');
      for (let p = 0; p < parts.length; p++) {
        const part = parts[p];
        if (part) {
          const rawWords = part.split(' ');
          for (let w = 0; w < rawWords.length; w++) {
            const wordStr = rawWords[w];
            if (wordStr === '' && rawWords.length > 1) continue;

            const widthPt = measureTextWidthPt(
              wordStr,
              span.fontFamily || defaultFontFamily,
              span.fontSizePt || defaultFontSize,
              span.bold,
              span.italic
            );
            const spaceWidthPt = measureTextWidthPt(
              ' ',
              span.fontFamily || defaultFontFamily,
              span.fontSizePt || defaultFontSize,
              span.bold,
              span.italic
            );

            wordsWithStyle.push({
              word: wordStr,
              span,
              widthPt,
              spaceWidthPt,
            });
          }
        }
        if (p < parts.length - 1) {
          // Explicit line break within a block
          wordsWithStyle.push({
            word: '\n',
            span,
            widthPt: 0,
            spaceWidthPt: 0,
          });
        }
      }
    }

    // Build wrapped lines for this block
    const blockLines: PageLine[] = [];
    let currentLineSpans: (InlineSpan & { widthPt: number })[] = [];
    let currentLineWidth = 0;
    let maxFontSizeOnLine = defaultFontSize;

    if (block.type === 'h1') maxFontSizeOnLine = 22;
    else if (block.type === 'h2') maxFontSizeOnLine = 16;
    else if (block.type === 'h3') maxFontSizeOnLine = 14;

    const commitLine = () => {
      if (currentLineSpans.length === 0) return;
      const lineHeight = Math.max(12, maxFontSizeOnLine * lineSpacing);
      const isFirst = blockLines.length === 0;

      let listMarker: string | undefined;
      if (isFirst) {
        if (block.type === 'bullet') listMarker = '•';
        else if (block.type === 'number') listMarker = `${block.listIndex || 1}.`;
      }

      blockLines.push({
        spans: currentLineSpans,
        lineWidthPt: currentLineWidth,
        lineHeightPt: lineHeight,
        isFirstLineOfBlock: isFirst,
        listMarker,
      });

      currentLineSpans = [];
      currentLineWidth = 0;
      maxFontSizeOnLine = defaultFontSize;
    };

    // If block is completely empty (e.g. user hit enter for blank line)
    if (wordsWithStyle.length === 0) {
      const lineHeight = defaultFontSize * lineSpacing;
      blockLines.push({
        spans: [
          {
            id: `${block.id}-empty`,
            text: '',
            fontFamily: defaultFontFamily,
            fontSizePt: defaultFontSize,
            bold: false,
            italic: false,
            underline: false,
            colorHex: '#0f172a',
            bgColorHex: null,
            widthPt: 0,
          },
        ],
        lineWidthPt: 0,
        lineHeightPt: lineHeight,
        isFirstLineOfBlock: true,
      });
    } else {
      for (let i = 0; i < wordsWithStyle.length; i++) {
        const item = wordsWithStyle[i];

        if (item.word === '\n') {
          commitLine();
          continue;
        }

        const isFirstInLine = currentLineSpans.length === 0;
        const addedWidth = isFirstInLine ? item.widthPt : item.spaceWidthPt + item.widthPt;
        const targetText = isFirstInLine ? item.word : ` ${item.word}`;

        if (isFirstInLine || currentLineWidth + addedWidth <= effectiveWidth) {
          currentLineSpans.push({
            ...item.span,
            text: targetText,
            widthPt: addedWidth,
          });
          currentLineWidth += addedWidth;
          maxFontSizeOnLine = Math.max(maxFontSizeOnLine, item.span.fontSizePt || defaultFontSize);
        } else {
          // Line wraps
          commitLine();
          currentLineSpans.push({
            ...item.span,
            text: item.word,
            widthPt: item.widthPt,
          });
          currentLineWidth = item.widthPt;
          maxFontSizeOnLine = Math.max(maxFontSizeOnLine, item.span.fontSizePt || defaultFontSize);
        }
      }
      commitLine();
    }

    // Calculate total height of this block
    const blockLinesHeight = blockLines.reduce((acc, l) => acc + l.lineHeightPt, 0);
    const blockTotalHeight = spacingAbove + blockLinesHeight + spacingBelow;

    // Heading keep-with-next protection: headings should never be stranded at the bottom of a page
    const isHeading = block.type === 'h1' || block.type === 'h2' || block.type === 'h3';
    const keepWithNextBuffer = isHeading ? 36 : 0;

    // Distribute block across pages:
    // If the entire block fits on a fresh page (blockTotalHeight <= contentHeightPt),
    // and it doesn't fit on the current page (or heading keep-with-next requires next page):
    // move the ENTIRE block to the next page cleanly.
    if (
      currentPageSlices.length > 0 &&
      blockTotalHeight <= contentHeightPt &&
      currentPageHeight + blockTotalHeight + keepWithNextBuffer > contentHeightPt
    ) {
      startNewPage(block.pos);
      currentPageHeight = 0;
    }

    // Now, if the block fits completely on the current page:
    if (currentPageHeight + blockTotalHeight <= contentHeightPt) {
      currentPageHeight += spacingAbove;
      currentPageSlices.push({
        blockId: block.id,
        type: block.type,
        align: block.align,
        indent: block.indent,
        lines: blockLines,
      });
      currentPageHeight += blockLinesHeight + spacingBelow;
    } else {
      // If the block is huge (e.g. paragraph longer than a full page):
      // distribute line by line
      currentPageHeight += spacingAbove;
      let currentSliceLines: PageLine[] = [];

      for (const line of blockLines) {
        if (
          currentPageHeight + line.lineHeightPt > contentHeightPt &&
          (currentPageSlices.length > 0 || currentSliceLines.length > 0)
        ) {
          if (currentSliceLines.length > 0) {
            currentPageSlices.push({
              blockId: block.id,
              type: block.type,
              align: block.align,
              indent: block.indent,
              lines: currentSliceLines,
            });
            currentSliceLines = [];
          }
          startNewPage(block.pos);
          currentPageHeight = 0;
        }

        currentSliceLines.push(line);
        currentPageHeight += line.lineHeightPt;
      }

      if (currentSliceLines.length > 0) {
        currentPageSlices.push({
          blockId: block.id,
          type: block.type,
          align: block.align,
          indent: block.indent,
          lines: currentSliceLines,
        });
      }

      currentPageHeight += spacingBelow;
    }
  }

  // Ensure at least one page exists even if document is completely empty
  // OR if the document ends with an explicit page break
  if (currentPageSlices.length > 0 || pages.length === 0 || currentFirstBlockPos !== undefined) {
    pages.push({
      pageIndex: currentPageIndex,
      pageNumber: currentPageIndex + 1,
      firstBlockPos: currentFirstBlockPos,
      usedHeightPt: currentPageHeight,
      blockSlices: currentPageSlices,
    });
  }

  return {
    pages,
    dimensions,
    totalPages: pages.length,
  };
}
