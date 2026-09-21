import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { tiptapToCanonical } from '../tiptapToCanonical';
import { paginateDocument, calculateDimensions } from '../paginator';
import { PageSizeOption, PageOrientationOption, MarginOption, FontFamilyOption } from '../types';

export interface VisualPaginationOptions {
  pageSize: PageSizeOption;
  orientation: PageOrientationOption;
  margin: MarginOption;
  fontFamily: FontFamilyOption;
  fontSize: number;
  lineSpacing: number;
  headerTitle: string;
  footerText: string;
  includePageNumbers: boolean;
  onTotalPagesChange?: (totalPages: number) => void;
}

export const visualPaginationPluginKey = new PluginKey('visualPagination');

function createPageBreakSpacerDOM(
  nextPageNumber: number,
  spacerHeight: number
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'visual-page-break-spacer';
  container.setAttribute('contenteditable', 'false');
  container.setAttribute('data-page-boundary', `${nextPageNumber}`);
  container.setAttribute('id', `page-separator-${nextPageNumber}`);
  container.style.userSelect = 'none';
  container.style.webkitUserSelect = 'none';
  container.style.pointerEvents = 'none';
  container.style.display = 'block';
  container.style.width = '100%';
  container.style.height = `${spacerHeight}px`;
  container.style.margin = '0';
  container.style.padding = '0';

  return container;
}

function buildPaginationDecorations(doc: any, options: VisualPaginationOptions): DecorationSet {
  try {
    const canonicalDoc = tiptapToCanonical(doc, options.fontFamily, options.fontSize);
    const dimensions = calculateDimensions(
      options.pageSize,
      options.orientation,
      options.margin,
      options.headerTitle,
      options.footerText,
      options.includePageNumbers
    );
    const paginated = paginateDocument(
      canonicalDoc,
      dimensions,
      options.lineSpacing,
      options.fontSize,
      options.fontFamily
    );

    if (options.onTotalPagesChange) {
      options.onTotalPagesChange(paginated.totalPages);
    }

    const ptToPx = 96 / 72;
    const contentHeightPx = Math.round(dimensions.contentHeightPt * ptToPx);
    const bottomMarginPx = Math.round(dimensions.bottomMarginPt * ptToPx);
    const topMarginPx = Math.round(dimensions.topMarginPt * ptToPx);
    const PAGE_GAP_PX = 36;

    const widgets: Decoration[] = [];
    const usedPositions = new Set<number>();

    for (let p = 1; p < paginated.pages.length; p++) {
      const prevPage = paginated.pages[p - 1];
      const page = paginated.pages[p];
      const pos = page.firstBlockPos;
      if (typeof pos === 'number' && pos > 0 && pos <= doc.content.size && !usedPositions.has(pos)) {
        usedPositions.add(pos);
        const usedHeightPx = Math.round((prevPage.usedHeightPt || 0) * ptToPx);
        const remainingWhitePx = Math.max(0, contentHeightPx - usedHeightPx);
        const spacerHeight = remainingWhitePx + bottomMarginPx + PAGE_GAP_PX + topMarginPx;

        const widget = Decoration.widget(
          pos,
          () => createPageBreakSpacerDOM(page.pageNumber, spacerHeight),
          { side: -1, stopEvent: () => true }
        );
        widgets.push(widget);
      }
    }

    return DecorationSet.create(doc, widgets);
  } catch (err) {
    console.error('VisualPagination decoration error:', err);
    return DecorationSet.empty;
  }
}

export const VisualPagination = Extension.create<VisualPaginationOptions>({
  name: 'visualPagination',

  addOptions() {
    return {
      pageSize: 'a4',
      orientation: 'portrait',
      margin: 'standard',
      fontFamily: 'Helvetica',
      fontSize: 12,
      lineSpacing: 1.4,
      headerTitle: '',
      footerText: '',
      includePageNumbers: true,
      onTotalPagesChange: undefined,
    };
  },

  addProseMirrorPlugins() {
    const extension = this;
    return [
      new Plugin({
        key: visualPaginationPluginKey,
        state: {
          init: (_, state) => {
            return buildPaginationDecorations(state.doc, extension.options);
          },
          apply: (tr, oldDecos, oldState, newState) => {
            const meta = tr.getMeta(visualPaginationPluginKey);
            if (meta && typeof meta === 'object') {
              Object.assign(extension.options, meta);
              return buildPaginationDecorations(newState.doc, extension.options);
            }
            if (tr.docChanged || meta === true) {
              return buildPaginationDecorations(newState.doc, extension.options);
            }
            return oldDecos.map(tr.mapping, newState.doc);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
