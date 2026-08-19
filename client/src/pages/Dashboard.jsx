import React from 'react';
import { Plus } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import StatsOverview from '../components/dashboard/StatsOverview';
import SearchBar from '../components/common/SearchBar';
import FilterDropdown from '../components/common/FilterDropdown';
import KanbanBoard from '../components/tasks/KanbanBoard';
import CalendarView from '../components/tasks/CalendarView';
import TaskCard from '../components/tasks/TaskCard';
import TaskTable from '../components/tasks/TaskTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
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
    setIsCreateModalOpen,
    resetFilters,
  } = useTask();

  const isFiltered = !!(searchQuery || statusFilter || priorityFilter || overdueFilter || sortBy !== 'newest');

  const renderTaskView = () => {
    if (loading) {
      return <LoadingSpinner label="Fetching your tasks..." />;
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          isFiltered={isFiltered}
          onCreateClick={() => setIsCreateModalOpen(true)}
          onResetClick={resetFilters}
        />
      );
    }

    switch (viewMode) {
      case 'kanban':
        return <KanbanBoard tasks={tasks} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'table':
        return <TaskTable tasks={tasks} />;
      case 'grid':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        );
    }
  };

  return (
    <MainLayout>
      {/* Dashboard Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
            Kanban Board & Workflow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="text-brand-500 font-semibold">{user?.name || 'User'}</span>! Track progress, manage task statuses, and organize deliverables.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      <StatsOverview />

      {/* Toolbar & Search Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <FilterDropdown
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          overdueFilter={overdueFilter}
          setOverdueFilter={setOverdueFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          resetFilters={resetFilters}
        />
      </div>

      {/* Main Task List Content */}
      <div className="min-h-[300px]">
        {renderTaskView()}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
