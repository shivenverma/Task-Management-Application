import React from 'react';
import Navbar from './Navbar';
import Toast from '../common/Toast';
import TaskFormModal from '../tasks/TaskFormModal';
import TaskDetailModal from '../tasks/TaskDetailModal';
import ConfirmModal from '../common/ConfirmModal';
import { useTask } from '../../context/TaskContext';

const MainLayout = ({ children }) => {
  const {
    toast,
    removeToast,
    isCreateModalOpen,
    setIsCreateModalOpen,
    editingTask,
    setEditingTask,
    viewingTask,
    setViewingTask,
    deletingTask,
    setDeletingTask,
    deleteTask,
    submitting,
  } = useTask();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Global Toast */}
      <Toast toast={toast} onClose={removeToast} />

      {/* Create Modal */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Modal */}
      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        initialData={editingTask}
      />

      {/* Detail View Modal */}
      <TaskDetailModal
        task={viewingTask}
        onClose={() => setViewingTask(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!deletingTask}
        title="Delete Task?"
        message={
          deletingTask
            ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this task?'
        }
        isDeleting={submitting}
        onConfirm={() => deletingTask && deleteTask(deletingTask._id)}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
};

export default MainLayout;
