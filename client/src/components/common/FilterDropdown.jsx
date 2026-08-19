import React from 'react';
import { Filter, ArrowUpDown, RotateCcw, AlertTriangle, Kanban, LayoutGrid, List, Calendar } from 'lucide-react';

const FilterDropdown = ({
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
  resetFilters,
}) => {
  const hasActiveFilters = statusFilter || priorityFilter || overdueFilter || sortBy !== 'newest';

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="appearance-none bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Priority Filter */}
      <div className="relative">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="appearance-none bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer shadow-sm"
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Overdue Toggle */}
      <button
        onClick={() => setOverdueFilter(!overdueFilter)}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
          overdueFilter
            ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/50 ring-2 ring-rose-500/30'
            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700/60'
        }`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
        Overdue Only
      </button>

      {/* Sort Selector */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 cursor-pointer shadow-sm"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      )}

      {/* View Mode Toggle Switcher */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-1 ml-auto">
        <button
          onClick={() => setViewMode('kanban')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === 'kanban'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Kanban Board View"
        >
          <Kanban className="w-3.5 h-3.5" />
          Board
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === 'grid'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Grid View"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Grid
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === 'table'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Table View"
        >
          <List className="w-3.5 h-3.5" />
          Table
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === 'calendar'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
          title="Calendar View"
        >
          <Calendar className="w-3.5 h-3.5" />
          Calendar
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
