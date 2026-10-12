import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { PageBreakView } from './PageBreakView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      setPageBreak: () => ReturnType;
    };
  }
}

export const PageBreak = Node.create({
  name: 'pageBreak',
  group: 'block',
  selectable: true,
  draggable: false,
  atom: true,

  parseHTML() {
    return [
      { tag: 'div[data-type="page-break"]' },
      { tag: 'div.page-break-node' },
      { tag: 'hr.page-break' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'page-break', class: 'page-break-node' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PageBreakView);
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ chain }: any) => {
          return chain().insertContent({ type: this.name }).run();
        },
    };
  },
});

