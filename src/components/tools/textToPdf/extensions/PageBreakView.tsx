import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Scissors, Trash2 } from 'lucide-react';

export const PageBreakView: React.FC<any> = ({ deleteNode }) => {
  return (
    <NodeViewWrapper className="page-break-node my-6 select-none" data-type="page-break">
      {/* End of Previous Page Border */}
      <div className="flex items-center justify-between py-1.5 px-3 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 rounded-t">
        <span className="italic font-serif">End of Page</span>
        <button
          type="button"
          onClick={deleteNode}
          className="inline-flex items-center gap-1 hover:text-rose-500 transition-colors text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs"
          title="Remove Page Break"
        >
          <Trash2 className="w-3 h-3 text-rose-400" />
          <span>Remove Break</span>
        </button>
      </div>

      {/* Authentic Visual Desk Gap between Pages */}
      <div className="relative -mx-6 sm:-mx-8 md:-mx-12 my-2 py-5 bg-slate-200/90 dark:bg-[#0b0e17] border-y border-slate-300 dark:border-slate-800 shadow-inner flex items-center justify-center">
        <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Scissors className="w-3 h-3 rotate-90" />
          <span>Page Break</span>
        </span>
      </div>

      {/* Start of Next Page Header line */}
      <div className="flex items-center justify-between py-1.5 px-3 text-[11px] text-slate-400 dark:text-slate-500 border-b border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 rounded-b">
        <span className="italic font-serif">Top of Next Page</span>
        <span className="font-mono text-[10px] uppercase tracking-wider">Reflow Boundary</span>
      </div>
    </NodeViewWrapper>
  );
};
