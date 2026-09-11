import { JSONContent } from '@tiptap/core';
import { CanonicalDocument, FormattedBlock, InlineSpan, BlockType, TextAlignOption } from './types';

export function tiptapToCanonical(
  json: JSONContent,
  defaultFontFamily = 'Helvetica',
  defaultFontSize = 12
): CanonicalDocument {
  const blocks: FormattedBlock[] = [];

  if (!json.content) return { blocks };

  let listIndex = 1;

  function traverse(nodes: JSONContent[], parentType?: string) {
    for (const node of nodes) {
      if (node.type === 'paragraph' || node.type === 'heading') {
        let blockType: BlockType = 'p';
        if (node.type === 'heading') {
          if (node.attrs?.level === 1) blockType = 'h1';
          if (node.attrs?.level === 2) blockType = 'h2';
          if (node.attrs?.level === 3) blockType = 'h3';
        }

        if (parentType === 'bulletList') {
          blockType = 'bullet';
        } else if (parentType === 'orderedList') {
          blockType = 'number';
        }

        const align: TextAlignOption = (node.attrs?.textAlign as TextAlignOption) || 'left';

        const spans: InlineSpan[] = [];
        if (node.content) {
          for (const textNode of node.content) {
            if (textNode.type === 'text' && textNode.text) {
              const span: InlineSpan = {
                id: Math.random().toString(36).substring(2),
                text: textNode.text,
                fontFamily: defaultFontFamily as any,
                fontSizePt: defaultFontSize,
                bold: false,
                italic: false,
                underline: false,
                colorHex: '#0f172a',
                bgColorHex: null,
              };

              if (textNode.marks) {
                for (const mark of textNode.marks) {
                  if (mark.type === 'bold') span.bold = true;
                  if (mark.type === 'italic') span.italic = true;
                  if (mark.type === 'underline') span.underline = true;
                  if (mark.type === 'textStyle' && mark.attrs?.color) span.colorHex = mark.attrs.color;
                  if (mark.type === 'highlight' && mark.attrs?.color) span.bgColorHex = mark.attrs.color;
                }
              }
              spans.push(span);
            }
          }
        } else {
          // Empty block gets an empty span to maintain line height
          spans.push({
            id: Math.random().toString(36).substring(2),
            text: '',
            fontFamily: defaultFontFamily as any,
            fontSizePt: defaultFontSize,
            bold: false,
            italic: false,
            underline: false,
            colorHex: '#000',
            bgColorHex: null,
          });
        }

        const block: FormattedBlock = {
          id: Math.random().toString(36).substring(2),
          type: blockType,
          align,
          spans,
        };

        if (blockType === 'number') {
          block.listIndex = listIndex++;
        }

        blocks.push(block);
      } else if (node.type === 'bulletList' || node.type === 'orderedList') {
        if (node.type === 'orderedList') listIndex = 1;
        if (node.content) {
          traverse(node.content, node.type);
        }
      } else if (node.type === 'listItem') {
        if (node.content) traverse(node.content, parentType);
      } else if (node.type === 'horizontalRule') {
        blocks.push({
          id: Math.random().toString(36).substring(2),
          type: 'hr',
          align: 'left',
          spans: [],
        });
      } else if (node.type === 'pageBreak') {
        blocks.push({
          id: Math.random().toString(36).substring(2),
          type: 'page-break',
          align: 'left',
          spans: [],
        });
      }
    }
  }

  traverse(json.content);
  return { blocks };
}
