import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { isTaskOverdue, formatDate } from '../../utils/dateUtils';
import { useTask } from '../../context/TaskContext';

const CalendarView = ({ tasks }) => {
  const { setViewingTask } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDayOfMonth = new Date(year, month, 1);
  // Total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Starting day index (0 = Sunday, 1 = Monday, etc.)
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to Monday start

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Find tasks matching specific day date
  const getTasksForDate = (dayNumber) => {
    return tasks.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === dayNumber
      );
    });
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Build calendar matrix cells
  const calendarCells = [];
  // Padding cells for previous month
  for (let i = 0; i < startDayIndex; i++) {
    calendarCells.push({ isPadding: true, key: `pad-${i}` });
  }
  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDate(day);
    const isToday = isCurrentMonth && today.getDate() === day;
    calendarCells.push({
      isPadding: false,
      dayNumber: day,
      dayTasks,
      isToday,
      key: `day-${day}`,
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {monthNames[month]} <span className="text-brand-600 dark:text-brand-400">{year}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-300 dark:border-slate-700">
            <button
              onClick={handlePrevMonth}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div className="text-rose-500 dark:text-rose-400">Sat</div>
        <div className="text-rose-500 dark:text-rose-400">Sun</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {calendarCells.map((cell) => {
          if (cell.isPadding) {
            return (
              <div
                key={cell.key}
                className="min-h-[90px] sm:min-h-[110px] bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-transparent"
              />
            );
          }

          return (
            <div
              key={cell.key}
              className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between ${
                cell.isToday
                  ? 'bg-brand-500/10 border-brand-500/50 ring-1 ring-brand-500/30'
                  : 'bg-slate-50/80 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    cell.isToday
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-800 dark:text-slate-300'
                  }`}
                >
                  {cell.dayNumber}
                </span>
                {cell.dayTasks.length > 0 && (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {cell.dayTasks.length} task{cell.dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Tasks List inside Day Cell */}
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[70px] pr-0.5">
                {cell.dayTasks.map((t) => {
                  const isOverdue = isTaskOverdue(t.dueDate, t.status);
                  return (
                    <div
                      key={t._id}
                      onClick={() => setViewingTask(t)}
                      className={`px-1.5 py-1 rounded-md text-[11px] font-semibold truncate cursor-pointer transition-all border ${
                        isOverdue
                          ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                          : t.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                          : t.status === 'In Progress'
                          ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border-brand-500/30'
                          : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      }`}
                      title={`${t.title} (${t.status})`}
                    >
                      {t.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
