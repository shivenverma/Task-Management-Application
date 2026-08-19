import React, { useState } from 'react';
import { Calendar, Edit3, Trash2, Eye, ChevronDown } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const TaskCard = ({ task }) => {
  const { setEditingTask, setViewingTask, setDeletingTask, updateTaskStatus } = useTask();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const isOverdue = isTaskOverdue(task.dueDate, task.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;
    setIsUpdatingStatus(true);
    await updateTaskStatus(task._id, newStatus);
    setIsUpdatingStatus(false);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 shadow-md hover:shadow-lg ${
        isOverdue
          ? 'bg-rose-50/80 dark:bg-slate-900/90 border-rose-300 dark:border-rose-500/30 hover:border-rose-500'
          : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-brand-500/50'
      }`}
    >
      <div>
        {/* Card Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} isOverdue={isOverdue} />
        </div>

        {/* Title */}
        <h4
          onClick={() => setViewingTask(task)}
          className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors line-clamp-2 cursor-pointer mb-2 leading-snug"
        >
          {task.title}
        </h4>

        {/* Short Description */}
        {task.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed font-normal">
            {task.description}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
        {/* Due Date & Quick Status Dropdown */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={isOverdue ? 'text-rose-500 font-semibold' : ''}>
              Due: {formatDate(task.dueDate)}
            </span>
          </div>

          {/* Quick status dropdown */}
          <div className="relative">
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={isUpdatingStatus}
              className="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 text-[11px] font-semibold rounded-lg px-2.5 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer disabled:opacity-50"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <button
            onClick={() => setViewingTask(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-slate-100 dark:hover:bg-brand-500/10 transition-colors"
            title="View Task Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingTask(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-amber-500/10 transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingTask(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-rose-500/10 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
