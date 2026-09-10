import { BlockType, FontFamilyOption, FormattedBlock, InlineSpan, TextAlignOption } from './types';

// Helper to convert rgb(r, g, b) or named color to hex #rrggbb
export function rgbToHex(colorStr: string): string {
  if (!colorStr) return '#0f172a';
  if (colorStr.startsWith('#')) return colorStr;
  if (colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') return 'transparent';

  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (match) {
    const r = parseInt(match[1], 10).toString(16).padStart(2, '0');
    const g = parseInt(match[2], 10).toString(16).padStart(2, '0');
    const b = parseInt(match[3], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#0f172a';
}

export function parsePlainTextToBlocks(text: string): FormattedBlock[] {
  const lines = text.split(/\r?\n/);
  const blocks: FormattedBlock[] = [];

  let listIndex = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    let type: BlockType = 'p';
    let content = line;
    let align: TextAlignOption = 'left';

    // Detect markdown-style headings
    if (line.startsWith('# ')) {
      type = 'h1';
      content = line.slice(2).trim();
    } else if (line.startsWith('## ')) {
      type = 'h2';
      content = line.slice(3).trim();
    } else if (line.startsWith('### ')) {
      type = 'h3';
      content = line.slice(4).trim();
    } else if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      type = 'bullet';
      content = line.slice(2).trim();
    } else if (/^\d+\.\s/.test(line)) {
      type = 'number';
      content = line.replace(/^\d+\.\s/, '').trim();
    } else if (line.trim() === '---' || line.trim() === '***') {
      type = 'hr';
      content = '';
    } else if (line.trim() === '<<<PAGE_BREAK>>>' || line.trim() === '[PAGE BREAK]') {
      type = 'page-break';
      content = '';
    }

    const span: InlineSpan = {
      id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: content,
      fontFamily: 'Helvetica',
      fontSizePt: type === 'h1' ? 22 : type === 'h2' ? 16 : type === 'h3' ? 14 : 12,
      bold: type === 'h1' || type === 'h2' || type === 'h3',
      italic: false,
      underline: false,
      colorHex: '#0f172a',
      bgColorHex: null,
    };

    blocks.push({
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${i}`,
      type,
      align,
      listIndex: type === 'number' ? listIndex++ : undefined,
      spans: [span],
    });
  }

  return blocks.length > 0
    ? blocks
    : [
        {
          id: `block-${Date.now()}`,
          type: 'p',
          align: 'left',
          spans: [
            {
              id: `span-${Date.now()}`,
              text: '',
              fontFamily: 'Helvetica',
              fontSizePt: 12,
              bold: false,
              italic: false,
              underline: false,
              colorHex: '#0f172a',
              bgColorHex: null,
            },
          ],
        },
      ];
}

export function parseDomToBlocks(container: HTMLElement): FormattedBlock[] {
  const blocks: FormattedBlock[] = [];
  const children = Array.from(container.children) as HTMLElement[];

  // If container has text directly without block elements
  if (children.length === 0) {
    const text = container.innerText || container.textContent || '';
    return parsePlainTextToBlocks(text);
  }

  let listCounter = 1;

  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    const tagName = el.tagName.toUpperCase();

    let type: BlockType = 'p';
    if (tagName === 'H1') type = 'h1';
    else if (tagName === 'H2') type = 'h2';
    else if (tagName === 'H3') type = 'h3';
    else if (tagName === 'LI') {
      const parentTag = el.parentElement?.tagName.toUpperCase();
      type = parentTag === 'OL' ? 'number' : 'bullet';
    } else if (tagName === 'UL') {
      // Process list children
      const lis = Array.from(el.querySelectorAll('li'));
      for (const li of lis) {
        blocks.push(parseSingleBlockElement(li, 'bullet', undefined));
      }
      continue;
    } else if (tagName === 'OL') {
      const lis = Array.from(el.querySelectorAll('li'));
      for (let liIdx = 0; liIdx < lis.length; liIdx++) {
        blocks.push(parseSingleBlockElement(lis[liIdx], 'number', liIdx + 1));
      }
      continue;
    } else if (tagName === 'HR') {
      type = 'hr';
    } else if (el.dataset.pageBreak === 'true' || el.classList.contains('doc-page-break')) {
      type = 'page-break';
    }

    blocks.push(parseSingleBlockElement(el, type, type === 'number' ? listCounter++ : undefined));
  }

  return blocks;
}

function parseSingleBlockElement(el: HTMLElement, type: BlockType, listIndex?: number): FormattedBlock {
  const alignStyle = el.style.textAlign || window.getComputedStyle(el).textAlign;
  let align: TextAlignOption = 'left';
  if (alignStyle === 'center') align = 'center';
  else if (alignStyle === 'right') align = 'right';
  else if (alignStyle === 'justify') align = 'justify';

  const spans: InlineSpan[] = [];

  function walk(node: Node, inheritedStyle: Partial<InlineSpan>) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.length > 0) {
        spans.push({
          id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          fontFamily: inheritedStyle.fontFamily || 'Helvetica',
          fontSizePt: inheritedStyle.fontSizePt || (type === 'h1' ? 22 : type === 'h2' ? 16 : type === 'h3' ? 14 : 12),
          bold: inheritedStyle.bold ?? (type === 'h1' || type === 'h2' || type === 'h3'),
          italic: inheritedStyle.italic ?? false,
          underline: inheritedStyle.underline ?? false,
          colorHex: inheritedStyle.colorHex || '#0f172a',
          bgColorHex: inheritedStyle.bgColorHex || null,
        });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as HTMLElement;
      const tag = elem.tagName.toUpperCase();

      const nextStyle = { ...inheritedStyle };

      if (tag === 'B' || tag === 'STRONG' || elem.style.fontWeight === 'bold' || parseInt(elem.style.fontWeight, 10) >= 600) {
        nextStyle.bold = true;
      }
      if (tag === 'I' || tag === 'EM' || elem.style.fontStyle === 'italic') {
        nextStyle.italic = true;
      }
      if (tag === 'U' || elem.style.textDecoration?.includes('underline')) {
        nextStyle.underline = true;
      }

      if (elem.style.color) {
        const hex = rgbToHex(elem.style.color);
        if (hex && hex !== 'transparent') nextStyle.colorHex = hex;
      }

      if (elem.style.backgroundColor || tag === 'MARK') {
        const bgHex = rgbToHex(elem.style.backgroundColor || '#fef08a');
        if (bgHex && bgHex !== 'transparent' && bgHex !== '#ffffff') {
          nextStyle.bgColorHex = bgHex;
        }
      }

      if (elem.style.fontSize) {
        const pt = parseFloat(elem.style.fontSize);
        if (!isNaN(pt) && pt > 0) nextStyle.fontSizePt = pt;
      }

      if (elem.style.fontFamily) {
        const fam = elem.style.fontFamily.toLowerCase();
        if (fam.includes('times') || fam.includes('serif')) nextStyle.fontFamily = 'TimesRoman';
        else if (fam.includes('courier') || fam.includes('mono')) nextStyle.fontFamily = 'Courier';
        else nextStyle.fontFamily = 'Helvetica';
      }

      for (const child of Array.from(elem.childNodes)) {
        walk(child, nextStyle);
      }
    }
  }

  for (const child of Array.from(el.childNodes)) {
    walk(child, {});
  }

  if (spans.length === 0) {
    spans.push({
      id: `span-${Date.now()}`,
      text: '',
      fontFamily: 'Helvetica',
      fontSizePt: type === 'h1' ? 22 : type === 'h2' ? 16 : type === 'h3' ? 14 : 12,
      bold: type === 'h1' || type === 'h2' || type === 'h3',
      italic: false,
      underline: false,
      colorHex: '#0f172a',
      bgColorHex: null,
    });
  }

  return {
    id: el.id || `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    align,
    listIndex,
    spans,
  };
}

export function getTextNodesInRange(range: Range): Text[] {
  const textNodes: Text[] = [];
  const root = range.commonAncestorContainer;

  const walker = document.createTreeWalker(
    root.nodeType === Node.TEXT_NODE ? root.parentNode! : root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  if (textNodes.length === 0 && root.nodeType === Node.TEXT_NODE) {
    textNodes.push(root as Text);
  }

  return textNodes;
}

export interface FormattingUpdate {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  colorHex?: string;
  bgColorHex?: string | null;
  fontFamily?: FontFamilyOption;
  fontSizePt?: number;
}

export function applyStyleToRange(range: Range, formatting: FormattingUpdate): void {
  if (range.collapsed) return;

  const textNodes = getTextNodesInRange(range);
  if (textNodes.length === 0) return;

  const createdSpans: HTMLElement[] = [];

  for (let i = 0; i < textNodes.length; i++) {
    let node = textNodes[i];
    const isStart = node === range.startContainer;
    const isEnd = node === range.endContainer;

    let start = 0;
    let end = node.textContent?.length || 0;

    if (isStart) start = range.startOffset;
    if (isEnd) end = range.endOffset;

    if (start >= end) continue;

    // Split at end first if needed
    if (end < (node.textContent?.length || 0)) {
      node.splitText(end);
    }
    // Split at start if needed
    if (start > 0) {
      node = node.splitText(start);
    }

    // Now node is exactly the selected text slice
    const span = document.createElement('span');

    if (formatting.bold !== undefined) {
      span.style.fontWeight = formatting.bold ? 'bold' : 'normal';
    }
    if (formatting.italic !== undefined) {
      span.style.fontStyle = formatting.italic ? 'italic' : 'normal';
    }
    if (formatting.underline !== undefined) {
      span.style.textDecoration = formatting.underline ? 'underline' : 'none';
    }
    if (formatting.colorHex) {
      span.style.color = formatting.colorHex;
    }
    if (formatting.bgColorHex !== undefined) {
      span.style.backgroundColor =
        formatting.bgColorHex === null || formatting.bgColorHex === 'transparent' ? '' : formatting.bgColorHex;
      if (formatting.bgColorHex && formatting.bgColorHex !== 'transparent') {
        span.style.borderRadius = '2px';
        span.style.padding = '0 1px';
      }
    }
    if (formatting.fontFamily) {
      span.style.fontFamily =
        formatting.fontFamily === 'TimesRoman'
          ? '"Times New Roman", Times, serif'
          : formatting.fontFamily === 'Courier'
          ? 'Courier, monospace'
          : 'Helvetica, Arial, sans-serif';
    }
    if (formatting.fontSizePt) {
      span.style.fontSize = `${formatting.fontSizePt}pt`;
    }

    node.parentNode?.replaceChild(span, node);
    span.appendChild(node);
    createdSpans.push(span);
  }

  // Restore selection across the created spans
  if (createdSpans.length > 0) {
    const sel = window.getSelection();
    if (sel) {
      const newRange = document.createRange();
      newRange.setStartBefore(createdSpans[0]);
      newRange.setEndAfter(createdSpans[createdSpans.length - 1]);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  }
}

export function clearFormattingInRange(range: Range): void {
  if (range.collapsed) return;

  const textNodes = getTextNodesInRange(range);
  for (const node of textNodes) {
    let parent = node.parentElement;
    while (parent && parent.tagName === 'SPAN') {
      const grandParent = parent.parentNode;
      if (!grandParent) break;
      while (parent.firstChild) {
        grandParent.insertBefore(parent.firstChild, parent);
      }
      grandParent.removeChild(parent);
      parent = grandParent as HTMLElement;
    }
  }
}
