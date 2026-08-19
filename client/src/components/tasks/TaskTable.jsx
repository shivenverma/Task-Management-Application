import React from 'react';
import { Calendar, Edit3, Trash2, Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const TaskTable = ({ tasks }) => {
  const { setEditingTask, setViewingTask, setDeletingTask } = useTask();

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xl">
      <table className="w-full text-left text-sm text-slate-800 dark:text-slate-300 border-collapse">
        <thead className="bg-slate-100 dark:bg-slate-850 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Title & Description</th>
            <th className="py-3.5 px-4 font-semibold">Status</th>
            <th className="py-3.5 px-4 font-semibold">Priority</th>
            <th className="py-3.5 px-4 font-semibold">Due Date</th>
            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {tasks.map((task) => {
            const isOverdue = isTaskOverdue(task.dueDate, task.status);
            return (
              <tr
                key={task._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                {/* Title & Description */}
                <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                  <div
                    onClick={() => setViewingTask(task)}
                    className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors cursor-pointer line-clamp-1"
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                      {task.description}
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={task.status} isOverdue={isOverdue} />
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Due Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                    <span className={isOverdue ? 'text-rose-500 font-semibold' : ''}>
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setViewingTask(task)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-slate-100 dark:hover:bg-brand-500/10 transition-colors"
                      title="View Details"
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
