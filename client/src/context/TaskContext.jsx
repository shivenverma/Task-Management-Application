import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { getSocket } from '../services/socket';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Filters & Options
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban', 'grid', 'table', or 'calendar'

  // Toast Notifications
  const [toast, setToast] = useState(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };

  const removeToast = () => {
    setToast(null);
  };

  // Fetch Stats dynamically from server
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (err) {
      console.error('[Fetch Stats Error]:', err);
    }
  }, [isAuthenticated]);

  // Fetch Tasks with filters
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (overdueFilter) params.overdue = 'true';
      if (sortBy) params.sortBy = sortBy;

      const res = await api.get('/tasks', { params });
      setTasks(res.data);
      await fetchStats();
    } catch (err) {
      console.error('[Fetch Tasks Error]:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, searchQuery, statusFilter, priorityFilter, overdueFilter, sortBy, fetchStats]);

  // Trigger task fetch on filter changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [fetchTasks, isAuthenticated]);

  // Real-time Socket Listener Integration
  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (!socket) return;

    const handleTaskCreated = (newTask) => {
      fetchTasks();
      showToast(`Real-time: New task "${newTask.title}" added!`, 'info');
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      fetchStats();
    };

    const handleTaskStatusChanged = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      fetchStats();
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      fetchStats();
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskStatusChanged', handleTaskStatusChanged);
    socket.on('taskDeleted', handleTaskDeleted);

    return () => {
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskStatusChanged', handleTaskStatusChanged);
      socket.off('taskDeleted', handleTaskDeleted);
    };
  }, [isAuthenticated, fetchTasks, fetchStats]);

  // CRUD Operations
  const createTask = async (taskData) => {
    setSubmitting(true);
    try {
      const res = await api.post('/tasks', taskData);
      showToast('Task created successfully!');
      setIsCreateModalOpen(false);
      await fetchTasks();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setSubmitting(true);
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      showToast('Task updated successfully!');
      setEditingTask(null);
      await fetchTasks();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const res = await api.patch(`/tasks/${id}/status`, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
      showToast(`Task status updated to "${status}"`);
      await fetchStats();
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const deleteTask = async (id) => {
    setSubmitting(true);
    try {
      await api.delete(`/tasks/${id}`);
      showToast('Task deleted successfully');
      setDeletingTask(null);
      await fetchTasks();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      showToast(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setOverdueFilter(false);
    setSortBy('newest');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        submitting,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        overdueFilter,
        setOverdueFilter,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        toast,
        showToast,
        removeToast,
        isCreateModalOpen,
        setIsCreateModalOpen,
        editingTask,
        setEditingTask,
        viewingTask,
        setViewingTask,
        deletingTask,
        setDeletingTask,
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        resetFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
