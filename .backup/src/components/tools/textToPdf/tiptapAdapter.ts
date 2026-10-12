import { JSONContent } from '@tiptap/react';
import {
  BlockType,
  CanonicalDocument,
  FontFamilyOption,
  FormattedBlock,
  InlineSpan,
  TextAlignOption,
} from './types';

/**
 * Converts TipTap's JSON document tree into a CanonicalDocument (FormattedBlock[]).
 * This canonical document represents the single source of truth for PDF compilation.
 * Guarantees zero text duplication and exact occurrence preservation.
 */
export function tiptapJsonToCanonicalDoc(
  json: JSONContent,
  defaultFontFamily: FontFamilyOption = 'Helvetica',
  defaultFontSize: number = 12
): CanonicalDocument {
  const blocks: FormattedBlock[] = [];
  if (!json.content) {
    return { blocks: [] };
  }

  let orderedListCounter = 1;

  for (let i = 0; i < json.content.length; i++) {
    const node = json.content[i];
    processNode(node);
  }

  function processNode(node: JSONContent) {
    if (node.type === 'pageBreak') {
      blocks.push({
        id: `break-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'page-break',
        align: 'left',
        spans: [],
      });
      return;
    }

    if (node.type === 'horizontalRule') {
      blocks.push({
        id: `hr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: 'hr',
        align: 'left',
        spans: [],
      });
      return;
    }

    if (node.type === 'bulletList') {
      if (node.content) {
        for (const item of node.content) {
          processListItem(item, 'bullet');
        }
      }
      return;
    }

    if (node.type === 'orderedList') {
      let counter = (node.attrs?.start as number) || orderedListCounter;
      if (node.content) {
        for (const item of node.content) {
          processListItem(item, 'number', counter++);
        }
      }
      orderedListCounter = counter;
      return;
    }

    let blockType: BlockType = 'p';
    if (node.type === 'heading') {
      const level = node.attrs?.level;
      if (level === 1) blockType = 'h1';
      else if (level === 2) blockType = 'h2';
      else if (level === 3) blockType = 'h3';
    }

    const align: TextAlignOption = (node.attrs?.textAlign as TextAlignOption) || 'left';
    const spans = extractSpans(node.content, blockType, defaultFontFamily, defaultFontSize);

    blocks.push({
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: blockType,
      align,
      spans,
    });
  }

  function processListItem(itemNode: JSONContent, listType: 'bullet' | 'number', numIndex?: number) {
    if (!itemNode.content) return;
    for (const child of itemNode.content) {
      const align: TextAlignOption = (child.attrs?.textAlign as TextAlignOption) || 'left';
      const spans = extractSpans(child.content, listType, defaultFontFamily, defaultFontSize);
      blocks.push({
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: listType,
        align,
        listIndex: numIndex,
        spans,
      });
    }
  }

  function extractSpans(
    content: JSONContent[] | undefined,
    blockType: BlockType,
    defaultFamily: FontFamilyOption,
    defaultSize: number
  ): InlineSpan[] {
    if (!content || content.length === 0) {
      return [
        {
          id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: '',
          fontFamily: defaultFamily,
          fontSizePt: blockType === 'h1' ? 22 : blockType === 'h2' ? 16 : blockType === 'h3' ? 14 : defaultSize,
          bold: blockType === 'h1' || blockType === 'h2' || blockType === 'h3',
          italic: false,
          underline: false,
          colorHex: '#0f172a',
          bgColorHex: null,
        },
      ];
    }

    const spans: InlineSpan[] = [];
    for (const child of content) {
      if (child.type === 'text') {
        const text = child.text || '';
        let bold = blockType === 'h1' || blockType === 'h2' || blockType === 'h3';
        let italic = false;
        let underline = false;
        let colorHex = '#0f172a';
        let bgColorHex: string | null = null;
        let fontFamily: FontFamilyOption = defaultFamily;
        let fontSizePt = blockType === 'h1' ? 22 : blockType === 'h2' ? 16 : blockType === 'h3' ? 14 : defaultSize;

        if (child.marks) {
          for (const mark of child.marks) {
            if (mark.type === 'bold') bold = true;
            if (mark.type === 'italic') italic = true;
            if (mark.type === 'underline') underline = true;
            if (mark.type === 'highlight') {
              bgColorHex = (mark.attrs?.color as string) || '#fef08a';
            }
            if (mark.type === 'textStyle') {
              if (mark.attrs?.color) colorHex = mark.attrs.color;
              if (mark.attrs?.fontFamily) {
                const fam = (mark.attrs.fontFamily as string).toLowerCase();
                if (fam.includes('times') || fam.includes('serif')) fontFamily = 'TimesRoman';
                else if (fam.includes('courier') || fam.includes('mono')) fontFamily = 'Courier';
                else fontFamily = 'Helvetica';
              }
              if (mark.attrs?.fontSize) {
                const pt = parseFloat(mark.attrs.fontSize);
                if (!isNaN(pt) && pt > 0) fontSizePt = pt;
              }
            }
          }
        }

        spans.push({
          id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          fontFamily,
          fontSizePt,
          bold,
          italic,
          underline,
          colorHex,
          bgColorHex,
        });
      } else if (child.type === 'hardBreak') {
        spans.push({
          id: `span-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text: '\n',
          fontFamily: defaultFamily,
          fontSizePt: defaultSize,
          bold: false,
          italic: false,
          underline: false,
          colorHex: '#0f172a',
          bgColorHex: null,
        });
      }
    }
    return spans;
  }

  return { blocks };
}

/**
 * Parses markdown-like plain text or sample text into clean HTML ready for TipTap.
 */
export function plainTextToTipTapHtml(text: string): string {
  const lines = text.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inBulletList = false;
  let inOrderedList = false;

  const closeLists = () => {
    if (inBulletList) {
      htmlParts.push('</ul>');
      inBulletList = false;
    }
    if (inOrderedList) {
      htmlParts.push('</ol>');
      inOrderedList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeLists();
      continue;
    }

    if (trimmed === '<<<PAGE_BREAK>>>' || trimmed === '[PAGE BREAK]') {
      closeLists();
      htmlParts.push('<div data-type="page-break"></div>');
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      closeLists();
      htmlParts.push('<hr>');
      continue;
    }

    if (trimmed.startsWith('# ')) {
      closeLists();
      htmlParts.push(`<h1>${escapeHtml(trimmed.slice(2).trim())}</h1>`);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      closeLists();
      htmlParts.push(`<h2>${escapeHtml(trimmed.slice(3).trim())}</h2>`);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      closeLists();
      htmlParts.push(`<h3>${escapeHtml(trimmed.slice(4).trim())}</h3>`);
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      if (!inBulletList) {
        closeLists();
        htmlParts.push('<ul>');
        inBulletList = true;
      }
      htmlParts.push(`<li><p>${escapeHtml(trimmed.slice(2).trim())}</p></li>`);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (!inOrderedList) {
        closeLists();
        htmlParts.push('<ol>');
        inOrderedList = true;
      }
      htmlParts.push(`<li><p>${escapeHtml(trimmed.replace(/^\d+\.\s/, '').trim())}</p></li>`);
      continue;
    }

    closeLists();
    htmlParts.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  closeLists();
  return htmlParts.join('');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
