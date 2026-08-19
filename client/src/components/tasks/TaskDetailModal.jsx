import React from 'react';
import { X, Calendar, Edit3, Trash2, Clock } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const TaskDetailModal = ({ task, onClose }) => {
  const { setEditingTask, setDeletingTask } = useTask();

  if (!task) return null;

  const isOverdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up text-slate-900 dark:text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} isOverdue={isOverdue} />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold leading-snug">{task.title}</h2>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-1 font-medium">Due Date</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <Calendar className={`w-4 h-4 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                <span className={isOverdue ? 'text-rose-500' : ''}>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block mb-1 font-medium">Created On</span>
              <div className="flex items-center gap-1.5 font-semibold">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50">
          <button
            onClick={() => {
              onClose();
              setDeletingTask(task);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 px-3 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Task
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                setEditingTask(task);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-md shadow-brand-600/30"
            >
              <Edit3 className="w-4 h-4" />
              Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
