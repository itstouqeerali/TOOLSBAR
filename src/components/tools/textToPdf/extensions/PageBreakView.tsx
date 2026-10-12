import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Scissors, Trash2 } from 'lucide-react';

export const PageBreakView: React.FC<any> = ({ deleteNode }) => {
  return (
    <NodeViewWrapper className="page-break-node my-1 select-none" data-type="page-break">
      <div className="flex items-center gap-2 py-1 text-[11px] text-slate-400 dark:text-slate-500 border-b border-dashed border-indigo-300 dark:border-indigo-700/60 opacity-80 hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
          <Scissors className="w-3 h-3 rotate-90" />
          <span>Page Break</span>
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={deleteNode}
          className="inline-flex items-center gap-1 hover:text-rose-500 text-slate-400 transition-colors text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
          title="Remove Page Break"
        >
          <Trash2 className="w-3 h-3 text-rose-400" />
          <span>Remove Break</span>
        </button>
      </div>
    </NodeViewWrapper>
  );
};
