import {
  BlockType,
  CanonicalDocument,
  FontFamilyOption,
  FormattedBlock,
  InlineSpan,
  TextAlignOption,
} from './types';

export interface FormattingOptions {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  colorHex?: string;
  bgColorHex?: string | null;
  fontFamily?: FontFamilyOption;
  fontSizePt?: number;
}

// Generate unique ID
function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Deep clone canonical doc
export function cloneCanonicalDoc(doc: CanonicalDocument): CanonicalDocument {
  return {
    blocks: doc.blocks.map((b) => ({
      ...b,
      spans: b.spans.map((s) => ({ ...s })),
    })),
  };
}

// Count words and chars strictly
export function countCanonicalStats(doc: CanonicalDocument): { words: number; chars: number } {
  let chars = 0;
  let words = 0;
  for (const block of doc.blocks) {
    for (const span of block.spans) {
      chars += span.text.length;
      const rawWords = span.text.trim().split(/\s+/).filter(Boolean);
      words += rawWords.length;
    }
  }
  return { words, chars };
}

// Parse plain text to canonical blocks
export function parsePlainTextToCanonical(
  text: string,
  defaultFontFamily: FontFamilyOption = 'Helvetica',
  defaultFontSize: number = 12
): CanonicalDocument {
  const lines = text.split(/\r?\n/);
  const blocks: FormattedBlock[] = [];
  let listIndex = 1;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Check for explicit page break token
    if (
      line.trim() === '<<<PAGE_BREAK>>>' ||
      line.trim() === '[PAGE BREAK]' ||
      line.trim() === '---PAGE BREAK---'
    ) {
      blocks.push({
        id: generateId('block-pb'),
        type: 'page-break',
        align: 'left',
        spans: [],
      });
      listIndex = 1;
      continue;
    }

    // Check for horizontal rule
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      blocks.push({
        id: generateId('block-hr'),
        type: 'hr',
        align: 'left',
        spans: [],
      });
      listIndex = 1;
      continue;
    }

    let type: BlockType = 'p';
    let content = line;
    let align: TextAlignOption = 'left';

    if (line.startsWith('# ')) {
      type = 'h1';
      content = line.slice(2).trim();
      listIndex = 1;
    } else if (line.startsWith('## ')) {
      type = 'h2';
      content = line.slice(3).trim();
      listIndex = 1;
    } else if (line.startsWith('### ')) {
      type = 'h3';
      content = line.slice(4).trim();
      listIndex = 1;
    } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      type = 'bullet';
      content = line.slice(2).trim();
      listIndex = 1;
    } else if (/^\d+\.\s/.test(line)) {
      type = 'number';
      content = line.replace(/^\d+\.\s/, '').trim();
    } else {
      listIndex = 1;
    }

    const isH1 = type === 'h1';
    const isH2 = type === 'h2';
    const isH3 = type === 'h3';

    const spanFontSize = isH1 ? 22 : isH2 ? 16 : isH3 ? 14 : defaultFontSize;
    const spanBold = isH1 || isH2 || isH3;

    const span: InlineSpan = {
      id: generateId('span'),
      text: content,
      fontFamily: defaultFontFamily,
      fontSizePt: spanFontSize,
      bold: spanBold,
      italic: false,
      underline: false,
      colorHex: '#0f172a',
      bgColorHex: null,
    };

    blocks.push({
      id: generateId('block'),
      type,
      align,
      listIndex: type === 'number' ? listIndex++ : undefined,
      spans: [span],
    });
  }

  if (blocks.length === 0) {
    blocks.push({
      id: generateId('block'),
      type: 'p',
      align: 'left',
      spans: [
        {
          id: generateId('span'),
          text: '',
          fontFamily: defaultFontFamily,
          fontSizePt: defaultFontSize,
          bold: false,
          italic: false,
          underline: false,
          colorHex: '#0f172a',
          bgColorHex: null,
        },
      ],
    });
  }

  return { blocks };
}

// Selection Target Coordinates in Canonical Model
export interface CanonicalSelection {
  startBlockId: string;
  startSpanId: string;
  startOffset: number;
  endBlockId: string;
  endSpanId: string;
  endOffset: number;
}

// Find block and span indices
function findBlockAndSpanIndex(
  doc: CanonicalDocument,
  blockId: string,
  spanId: string
): { blockIndex: number; spanIndex: number } | null {
  for (let b = 0; b < doc.blocks.length; b++) {
    if (doc.blocks[b].id === blockId) {
      for (let s = 0; s < doc.blocks[b].spans.length; s++) {
        if (doc.blocks[b].spans[s].id === spanId) {
          return { blockIndex: b, spanIndex: s };
        }
      }
      // If span not found directly, return first span
      return { blockIndex: b, spanIndex: 0 };
    }
  }
  return null;
}

// Apply inline formatting to a canonical selection without duplicating any text
export function applyStyleToCanonicalDoc(
  doc: CanonicalDocument,
  selection: CanonicalSelection,
  formatting: FormattingOptions
): CanonicalDocument {
  const newDoc = cloneCanonicalDoc(doc);

  const startLoc = findBlockAndSpanIndex(newDoc, selection.startBlockId, selection.startSpanId);
  const endLoc = findBlockAndSpanIndex(newDoc, selection.endBlockId, selection.endSpanId);

  if (!startLoc || !endLoc) return newDoc;

  let firstBlockIdx = Math.min(startLoc.blockIndex, endLoc.blockIndex);
  let lastBlockIdx = Math.max(startLoc.blockIndex, endLoc.blockIndex);

  let isForward =
    startLoc.blockIndex < endLoc.blockIndex ||
    (startLoc.blockIndex === endLoc.blockIndex &&
      (startLoc.spanIndex < endLoc.spanIndex ||
        (startLoc.spanIndex === endLoc.spanIndex && selection.startOffset <= selection.endOffset)));

  const sBlockIdx = isForward ? startLoc.blockIndex : endLoc.blockIndex;
  const sSpanIdx = isForward ? startLoc.spanIndex : endLoc.spanIndex;
  const sOffset = isForward ? selection.startOffset : selection.endOffset;

  const eBlockIdx = isForward ? endLoc.blockIndex : startLoc.blockIndex;
  const eSpanIdx = isForward ? endLoc.spanIndex : startLoc.spanIndex;
  const eOffset = isForward ? selection.endOffset : selection.startOffset;

  function updateSpanProps(span: InlineSpan): InlineSpan {
    return {
      ...span,
      bold: formatting.bold !== undefined ? formatting.bold : span.bold,
      italic: formatting.italic !== undefined ? formatting.italic : span.italic,
      underline: formatting.underline !== undefined ? formatting.underline : span.underline,
      colorHex: formatting.colorHex !== undefined ? formatting.colorHex : span.colorHex,
      bgColorHex: formatting.bgColorHex !== undefined ? formatting.bgColorHex : span.bgColorHex,
      fontFamily: formatting.fontFamily !== undefined ? formatting.fontFamily : span.fontFamily,
      fontSizePt: formatting.fontSizePt !== undefined ? formatting.fontSizePt : span.fontSizePt,
    };
  }

  for (let bIdx = firstBlockIdx; bIdx <= lastBlockIdx; bIdx++) {
    const block = newDoc.blocks[bIdx];
    const newSpans: InlineSpan[] = [];

    const isFirstBlock = bIdx === sBlockIdx;
    const isLastBlock = bIdx === eBlockIdx;

    for (let sIdx = 0; sIdx < block.spans.length; sIdx++) {
      const span = block.spans[sIdx];
      const spanText = span.text;

      const isStartSpan = isFirstBlock && sIdx === sSpanIdx;
      const isEndSpan = isLastBlock && sIdx === eSpanIdx;

      if (isStartSpan && isEndSpan) {
        // Selection is entirely within this one span
        const start = Math.max(0, Math.min(sOffset, spanText.length));
        const end = Math.max(start, Math.min(eOffset, spanText.length));

        if (start > 0) {
          newSpans.push({
            ...span,
            id: generateId('span'),
            text: spanText.slice(0, start),
          });
        }
        if (end > start) {
          newSpans.push(
            updateSpanProps({
              ...span,
              id: generateId('span'),
              text: spanText.slice(start, end),
            })
          );
        }
        if (end < spanText.length) {
          newSpans.push({
            ...span,
            id: generateId('span'),
            text: spanText.slice(end),
          });
        }
      } else if (isStartSpan) {
        // Starts in this span, ends later
        const start = Math.max(0, Math.min(sOffset, spanText.length));
        if (start > 0) {
          newSpans.push({
            ...span,
            id: generateId('span'),
            text: spanText.slice(0, start),
          });
        }
        if (spanText.length > start) {
          newSpans.push(
            updateSpanProps({
              ...span,
              id: generateId('span'),
              text: spanText.slice(start),
            })
          );
        }
      } else if (isEndSpan) {
        // Ends in this span, started earlier
        const end = Math.max(0, Math.min(eOffset, spanText.length));
        if (end > 0) {
          newSpans.push(
            updateSpanProps({
              ...span,
              id: generateId('span'),
              text: spanText.slice(0, end),
            })
          );
        }
        if (spanText.length > end) {
          newSpans.push({
            ...span,
            id: generateId('span'),
            text: spanText.slice(end),
          });
        }
      } else {
        // Check if span is in between start and end
        const isAfterStart = !isFirstBlock || sIdx > sSpanIdx;
        const isBeforeEnd = !isLastBlock || sIdx < eSpanIdx;

        if (isAfterStart && isBeforeEnd) {
          newSpans.push(
            updateSpanProps({
              ...span,
              id: generateId('span'),
            })
          );
        } else {
          newSpans.push(span);
        }
      }
    }

    block.spans = newSpans.length > 0 ? newSpans : [spanFallback(block.type)];
  }

  return newDoc;
}

function spanFallback(type: BlockType): InlineSpan {
  return {
    id: generateId('span'),
    text: '',
    fontFamily: 'Helvetica',
    fontSizePt: type === 'h1' ? 22 : type === 'h2' ? 16 : type === 'h3' ? 14 : 12,
    bold: type === 'h1' || type === 'h2' || type === 'h3',
    italic: false,
    underline: false,
    colorHex: '#0f172a',
    bgColorHex: null,
  };
}

// Apply alignment to a block or range of blocks
export function applyAlignToCanonicalDoc(
  doc: CanonicalDocument,
  blockIds: string[],
  align: TextAlignOption
): CanonicalDocument {
  const newDoc = cloneCanonicalDoc(doc);
  const targetIds = new Set(blockIds);

  for (const block of newDoc.blocks) {
    if (targetIds.has(block.id)) {
      block.align = align;
    }
  }
  return newDoc;
}

// Apply block type (heading, bullet, number, p) to blocks
export function applyBlockTypeToCanonicalDoc(
  doc: CanonicalDocument,
  blockIds: string[],
  type: BlockType,
  defaultFontFamily: FontFamilyOption = 'Helvetica',
  defaultFontSize: number = 12
): CanonicalDocument {
  const newDoc = cloneCanonicalDoc(doc);
  const targetIds = new Set(blockIds);

  let numIndex = 1;
  for (const block of newDoc.blocks) {
    if (targetIds.has(block.id)) {
      block.type = type;
      if (type === 'number') {
        block.listIndex = numIndex++;
      } else {
        block.listIndex = undefined;
      }

      // Update span typography for headings
      const headingSize = type === 'h1' ? 22 : type === 'h2' ? 16 : type === 'h3' ? 14 : defaultFontSize;
      const headingBold = type === 'h1' || type === 'h2' || type === 'h3';

      for (const span of block.spans) {
        if (headingBold) {
          span.bold = true;
          span.fontSizePt = headingSize;
        } else if (type === 'p' || type === 'bullet' || type === 'number') {
          // If downgrading from heading, restore normal size
          if (span.fontSizePt >= 14) {
            span.fontSizePt = defaultFontSize;
            span.bold = false;
          }
        }
      }
    } else if (block.type === 'number') {
      block.listIndex = numIndex++;
    } else {
      numIndex = 1;
    }
  }

  return newDoc;
}

// Insert manual page break
export function insertPageBreakToCanonicalDoc(
  doc: CanonicalDocument,
  targetBlockId?: string
): CanonicalDocument {
  const newDoc = cloneCanonicalDoc(doc);
  const pbBlock: FormattedBlock = {
    id: generateId('block-pb'),
    type: 'page-break',
    align: 'left',
    spans: [],
  };

  if (!targetBlockId) {
    newDoc.blocks.push(pbBlock);
    return newDoc;
  }

  const idx = newDoc.blocks.findIndex((b) => b.id === targetBlockId);
  if (idx === -1) {
    newDoc.blocks.push(pbBlock);
  } else {
    newDoc.blocks.splice(idx + 1, 0, pbBlock);
  }
  return newDoc;
}

// Insert horizontal rule
export function insertHrToCanonicalDoc(
  doc: CanonicalDocument,
  targetBlockId?: string
): CanonicalDocument {
  const newDoc = cloneCanonicalDoc(doc);
  const hrBlock: FormattedBlock = {
    id: generateId('block-hr'),
    type: 'hr',
    align: 'left',
    spans: [],
  };

  if (!targetBlockId) {
    newDoc.blocks.push(hrBlock);
    return newDoc;
  }

  const idx = newDoc.blocks.findIndex((b) => b.id === targetBlockId);
  if (idx === -1) {
    newDoc.blocks.push(hrBlock);
  } else {
    newDoc.blocks.splice(idx + 1, 0, hrBlock);
  }
  return newDoc;
}

// Clear all formatting on selected spans
export function clearFormattingFromCanonicalDoc(
  doc: CanonicalDocument,
  selection: CanonicalSelection,
  defaultFontFamily: FontFamilyOption = 'Helvetica',
  defaultFontSize: number = 12
): CanonicalDocument {
  return applyStyleToCanonicalDoc(doc, selection, {
    bold: false,
    italic: false,
    underline: false,
    colorHex: '#0f172a',
    bgColorHex: null,
    fontFamily: defaultFontFamily,
    fontSizePt: defaultFontSize,
  });
}

// Update block text content
export function updateBlockTextInCanonicalDoc(
  doc: CanonicalDocument,
  blockId: string,
  newText: string,
  defaultFontFamily: FontFamilyOption = 'Helvetica',
  defaultFontSize: number = 12
): CanonicalDocument {
  const newDoc = cloneCanonicalDoc(doc);
  const block = newDoc.blocks.find((b) => b.id === blockId);
  if (!block) return newDoc;

  // Preserve existing formatting of first span if possible
  const firstSpan = block.spans[0] || {
    id: generateId('span'),
    text: '',
    fontFamily: defaultFontFamily,
    fontSizePt: defaultFontSize,
    bold: false,
    italic: false,
    underline: false,
    colorHex: '#0f172a',
    bgColorHex: null,
  };

  block.spans = [
    {
      ...firstSpan,
      id: generateId('span'),
      text: newText,
    },
  ];

  return newDoc;
}
