import { JSONContent } from '@tiptap/core';
import { CanonicalDocument, FormattedBlock, InlineSpan, BlockType, TextAlignOption } from './types';

export function tiptapToCanonical(
  docOrJson: any,
  defaultFontFamily = 'Helvetica',
  defaultFontSize = 12
): CanonicalDocument {
  const blocks: FormattedBlock[] = [];
  if (!docOrJson) return { blocks };

  let listIndex = 1;

  // 1. ProseMirror Node traversal
  if (typeof docOrJson.forEach === 'function' && docOrJson.type?.name === 'doc') {
    const processNode = (node: any, pos: number, parentType?: string) => {
      const nodeType = node.type?.name;

      if (nodeType === 'paragraph' || nodeType === 'heading') {
        let blockType: BlockType = 'p';
        if (nodeType === 'heading') {
          const level = node.attrs?.level;
          if (level === 1) blockType = 'h1';
          if (level === 2) blockType = 'h2';
          if (level === 3) blockType = 'h3';
        }

        if (parentType === 'bulletList') {
          blockType = 'bullet';
        } else if (parentType === 'orderedList') {
          blockType = 'number';
        }

        const align: TextAlignOption = (node.attrs?.textAlign as TextAlignOption) || 'left';

        let blockFontSize = defaultFontSize;
        let blockBold = false;
        if (blockType === 'h1') {
          blockFontSize = 22;
          blockBold = true;
        } else if (blockType === 'h2') {
          blockFontSize = 17;
          blockBold = true;
        } else if (blockType === 'h3') {
          blockFontSize = 14;
          blockBold = true;
        }

        const spans: InlineSpan[] = [];
        if (node.content && node.content.size > 0) {
          node.forEach((textNode: any) => {
            if (textNode.isText && textNode.text) {
              const span: InlineSpan = {
                id: Math.random().toString(36).substring(2),
                text: textNode.text,
                fontFamily: defaultFontFamily as any,
                fontSizePt: blockFontSize,
                bold: blockBold,
                italic: false,
                underline: false,
                strikethrough: false,
                colorHex: '#0f172a',
                bgColorHex: null,
              };

              if (textNode.marks) {
                for (const mark of textNode.marks) {
                  const mType = mark.type?.name;
                  if (mType === 'bold') span.bold = true;
                  if (mType === 'italic') span.italic = true;
                  if (mType === 'underline') span.underline = true;
                  if (mType === 'strike') span.strikethrough = true;
                  if (mType === 'textStyle') {
                    if (mark.attrs?.color) span.colorHex = mark.attrs.color;
                    if (mark.attrs?.fontSize) {
                      const match = String(mark.attrs.fontSize).match(/\d+/);
                      if (match) {
                        const parsed = parseInt(match[0], 10);
                        if (!isNaN(parsed) && parsed >= 6 && parsed <= 72) {
                          span.fontSizePt = parsed;
                        }
                      }
                    }
                    if (mark.attrs?.fontFamily) {
                      const fam = String(mark.attrs.fontFamily).toLowerCase();
                      if (fam.includes('times')) span.fontFamily = 'TimesRoman';
                      else if (fam.includes('courier')) span.fontFamily = 'Courier';
                      else span.fontFamily = 'Helvetica';
                    }
                  }
                  if (mType === 'highlight' && mark.attrs?.color) span.bgColorHex = mark.attrs.color;
                }
              }
              spans.push(span);
            }
          });
        }

        if (spans.length === 0) {
          spans.push({
            id: Math.random().toString(36).substring(2),
            text: '',
            fontFamily: defaultFontFamily as any,
            fontSizePt: blockFontSize,
            bold: blockBold,
            italic: false,
            underline: false,
            strikethrough: false,
            colorHex: '#000',
            bgColorHex: null,
          });
        }

        const block: FormattedBlock = {
          id: `b_${pos}`,
          pos,
          type: blockType,
          align,
          spans,
        };

        if (blockType === 'number') {
          block.listIndex = listIndex++;
        }

        blocks.push(block);
      } else if (nodeType === 'bulletList' || nodeType === 'orderedList') {
        if (nodeType === 'orderedList') listIndex = 1;
        node.forEach((listItem: any, itemOffset: number) => {
          const listItemPos = pos + 1 + itemOffset;
          listItem.forEach((innerNode: any, innerOffset: number) => {
            const innerNodePos = listItemPos + 1 + innerOffset;
            processNode(innerNode, innerNodePos, nodeType);
          });
        });
      } else if (nodeType === 'horizontalRule') {
        blocks.push({
          id: `b_${pos}`,
          pos,
          type: 'hr',
          align: 'left',
          spans: [],
        });
      } else if (nodeType === 'pageBreak') {
        blocks.push({
          id: `b_${pos}`,
          pos,
          type: 'page-break',
          align: 'left',
          spans: [],
        });
      }
    };

    docOrJson.forEach((childNode: any, childPos: number) => {
      processNode(childNode, childPos);
    });

    return { blocks };
  }

  // 2. Standard JSONContent traversal
  const json = docOrJson as JSONContent;
  if (!json.content) return { blocks };

  let syntheticPos = 0;
  function traverse(nodes: JSONContent[], parentType?: string) {
    for (const node of nodes) {
      const currentPos = syntheticPos;
      syntheticPos += 2; // rough node size increment

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

        let blockFontSize = defaultFontSize;
        let blockBold = false;
        if (blockType === 'h1') {
          blockFontSize = 22;
          blockBold = true;
        } else if (blockType === 'h2') {
          blockFontSize = 17;
          blockBold = true;
        } else if (blockType === 'h3') {
          blockFontSize = 14;
          blockBold = true;
        }

        const spans: InlineSpan[] = [];
        if (node.content) {
          for (const textNode of node.content) {
            if (textNode.type === 'text' && textNode.text) {
              const span: InlineSpan = {
                id: Math.random().toString(36).substring(2),
                text: textNode.text,
                fontFamily: defaultFontFamily as any,
                fontSizePt: blockFontSize,
                bold: blockBold,
                italic: false,
                underline: false,
                strikethrough: false,
                colorHex: '#0f172a',
                bgColorHex: null,
              };

              if (textNode.marks) {
                for (const mark of textNode.marks) {
                  if (mark.type === 'bold') span.bold = true;
                  if (mark.type === 'italic') span.italic = true;
                  if (mark.type === 'underline') span.underline = true;
                  if (mark.type === 'strike') span.strikethrough = true;
                  if (mark.type === 'textStyle') {
                    if (mark.attrs?.color) span.colorHex = mark.attrs.color;
                    if (mark.attrs?.fontSize) {
                      const match = String(mark.attrs.fontSize).match(/\d+/);
                      if (match) {
                        const parsed = parseInt(match[0], 10);
                        if (!isNaN(parsed) && parsed >= 6 && parsed <= 72) {
                          span.fontSizePt = parsed;
                        }
                      }
                    }
                    if (mark.attrs?.fontFamily) {
                      const fam = String(mark.attrs.fontFamily).toLowerCase();
                      if (fam.includes('times')) span.fontFamily = 'TimesRoman';
                      else if (fam.includes('courier')) span.fontFamily = 'Courier';
                      else span.fontFamily = 'Helvetica';
                    }
                  }
                  if (mark.type === 'highlight' && mark.attrs?.color) span.bgColorHex = mark.attrs.color;
                }
              }
              spans.push(span);
            }
          }
        } else {
          spans.push({
            id: Math.random().toString(36).substring(2),
            text: '',
            fontFamily: defaultFontFamily as any,
            fontSizePt: blockFontSize,
            bold: blockBold,
            italic: false,
            underline: false,
            strikethrough: false,
            colorHex: '#000',
            bgColorHex: null,
          });
        }

        const block: FormattedBlock = {
          id: `b_${currentPos}`,
          pos: currentPos,
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
          id: `b_${currentPos}`,
          pos: currentPos,
          type: 'hr',
          align: 'left',
          spans: [],
        });
      } else if (node.type === 'pageBreak') {
        blocks.push({
          id: `b_${currentPos}`,
          pos: currentPos,
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
