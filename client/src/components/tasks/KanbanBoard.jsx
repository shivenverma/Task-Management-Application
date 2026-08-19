import React, { useState } from 'react';
import { Plus, Clock, Loader2, CheckCircle2, Calendar, Edit3, Trash2, Eye } from 'lucide-react';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import { formatDate, isTaskOverdue } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const KanbanBoard = ({ tasks }) => {
  const {
    setIsCreateModalOpen,
    setEditingTask,
    setViewingTask,
    setDeletingTask,
    updateTaskStatus,
  } = useTask();

  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const columns = [
    {
      id: 'Pending',
      title: 'Pending',
      icon: Clock,
      color: 'amber',
      headerBg: 'bg-amber-500/10 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400',
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      icon: Loader2,
      color: 'brand',
      headerBg: 'bg-brand-500/10 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-400',
    },
    {
      id: 'Completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: 'emerald',
      headerBg: 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    },
  ];

  // Group tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== targetStatus) {
        await updateTaskStatus(taskId, targetStatus);
      }
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className="flex flex-col bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 min-h-[500px] shadow-lg"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${column.headerBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {column.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={`Add ${column.title} task`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Task Cards */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-300 dark:border-slate-800/80 rounded-xl my-2">
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    No tasks in {column.title}
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isOverdue = isTaskOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className={`group relative p-4 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing ${
                        isOverdue
                          ? 'bg-rose-50/80 dark:bg-slate-900/90 border-rose-300 dark:border-rose-500/40 hover:border-rose-500'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-brand-500/50'
                      }`}
                    >
                      {/* Priority & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <PriorityBadge priority={task.priority} />
                        {isOverdue && <StatusBadge status={task.status} isOverdue={true} />}
                      </div>

                      {/* Title */}
                      <h4
                        onClick={() => setViewingTask(task)}
                        className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 cursor-pointer mb-2 leading-snug"
                      >
                        {task.title}
                      </h4>

                      {/* Description preview */}
                      {task.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed font-normal">
                          {task.description}
                        </p>
                      )}

                      {/* Footer Actions & Due Date */}
                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                          <span className={isOverdue ? 'text-rose-500 font-semibold' : ''}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingTask(task)}
                            className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingTask(task)}
                            className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingTask(task)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
