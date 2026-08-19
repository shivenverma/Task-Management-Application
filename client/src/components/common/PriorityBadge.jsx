import React from 'react';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

const PriorityBadge = ({ priority, className = '' }) => {
  switch (priority) {
    case 'High':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider ${className}`}
        >
          <ArrowUp className="w-3 h-3 text-red-400 stroke-[3]" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider ${className}`}
        >
          <ArrowRight className="w-3 h-3 text-amber-400 stroke-[3]" />
          Medium
        </span>
      );
    case 'Low':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-700/50 text-slate-300 border border-slate-600/40 uppercase tracking-wider ${className}`}
        >
          <ArrowDown className="w-3 h-3 text-slate-400 stroke-[3]" />
          Low
        </span>
      );
  }
};

export default PriorityBadge;
