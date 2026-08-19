import React from 'react';
import { ClipboardList, Plus, SearchX } from 'lucide-react';

const EmptyState = ({
  isFiltered = false,
  onCreateClick,
  onResetClick,
}) => {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl my-4">
        <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 text-slate-400">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">No matching tasks found</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6">
          We couldn't find any tasks matching your current search query or filter criteria.
        </p>
        {onResetClick && (
          <button
            onClick={onResetClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors"
          >
            Clear Filters & Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl my-4">
      <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 text-brand-400">
        <ClipboardList className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-1">No tasks yet</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        Create your first task and start organizing your work with real-time status tracking and due dates.
      </p>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Create First Task
        </button>
      )}
    </div>
  );
};

export default EmptyState;
