import React from 'react';
import { Layers, Clock, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatsCard from './StatsCard';
import { useTask } from '../../context/TaskContext';

const StatsOverview = () => {
  const {
    stats,
    statusFilter,
    setStatusFilter,
    overdueFilter,
    setOverdueFilter,
  } = useTask();

  const handleCardClick = (type) => {
    if (type === 'total') {
      setStatusFilter('');
      setOverdueFilter(false);
    } else if (type === 'pending') {
      setStatusFilter(statusFilter === 'Pending' ? '' : 'Pending');
      setOverdueFilter(false);
    } else if (type === 'inProgress') {
      setStatusFilter(statusFilter === 'In Progress' ? '' : 'In Progress');
      setOverdueFilter(false);
    } else if (type === 'completed') {
      setStatusFilter(statusFilter === 'Completed' ? '' : 'Completed');
      setOverdueFilter(false);
    } else if (type === 'overdue') {
      setOverdueFilter(!overdueFilter);
      setStatusFilter('');
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      <StatsCard
        title="Total Tasks"
        count={stats.total}
        icon={Layers}
        color="blue"
        isActive={!statusFilter && !overdueFilter}
        onClick={() => handleCardClick('total')}
      />
      <StatsCard
        title="Pending"
        count={stats.pending}
        icon={Clock}
        color="amber"
        isActive={statusFilter === 'Pending' && !overdueFilter}
        onClick={() => handleCardClick('pending')}
      />
      <StatsCard
        title="In Progress"
        count={stats.inProgress}
        icon={Loader2}
        color="purple"
        isActive={statusFilter === 'In Progress' && !overdueFilter}
        onClick={() => handleCardClick('inProgress')}
      />
      <StatsCard
        title="Completed"
        count={stats.completed}
        icon={CheckCircle2}
        color="emerald"
        isActive={statusFilter === 'Completed' && !overdueFilter}
        onClick={() => handleCardClick('completed')}
      />
      <StatsCard
        title="Overdue"
        count={stats.overdue}
        icon={AlertTriangle}
        color="rose"
        isActive={overdueFilter}
        onClick={() => handleCardClick('overdue')}
      />
    </div>
  );
};

export default StatsOverview;
