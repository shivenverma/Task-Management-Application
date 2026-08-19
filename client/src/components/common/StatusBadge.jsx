import React from 'react';
import { Clock, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status, isOverdue = false, className = '' }) => {
  if (isOverdue && status !== 'Completed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        Overdue
      </span>
    );
  }

  switch (status) {
    case 'Completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    case 'In Progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-400 border border-brand-500/30 ${className}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          In Progress
        </span>
      );
    case 'Pending':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending
        </span>
      );
  }
};

export default StatusBadge;
