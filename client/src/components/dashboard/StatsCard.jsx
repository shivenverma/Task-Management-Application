import React from 'react';

const StatsCard = ({ title, count, icon: Icon, color, isActive, onClick }) => {
  const getThemeClasses = () => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-red-500/10 dark:bg-brand-500/10 border-red-200 dark:border-brand-500/20 text-red-700 dark:text-brand-400',
          hover: 'hover:border-red-400 dark:hover:border-brand-500/40',
          active: 'ring-2 ring-red-500 border-red-500 bg-red-500/15 dark:bg-brand-500/20',
          iconBg: 'bg-red-100 dark:bg-brand-500/20 text-red-600 dark:text-brand-400',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400',
          hover: 'hover:border-amber-400 dark:hover:border-amber-500/40',
          active: 'ring-2 ring-amber-500 border-amber-500 bg-amber-100 dark:bg-amber-500/20',
          iconBg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
        };
      case 'purple':
        return {
          bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-800 dark:text-purple-400',
          hover: 'hover:border-purple-400 dark:hover:border-purple-500/40',
          active: 'ring-2 ring-purple-500 border-purple-500 bg-purple-100 dark:bg-purple-500/20',
          iconBg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400',
          hover: 'hover:border-emerald-400 dark:hover:border-emerald-500/40',
          active: 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-100 dark:bg-emerald-500/20',
          iconBg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-400',
          hover: 'hover:border-rose-400 dark:hover:border-rose-500/40',
          active: 'ring-2 ring-rose-500 border-rose-500 bg-rose-100 dark:bg-rose-500/20',
          iconBg: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
        };
      default:
        return {
          bg: 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-300',
          hover: 'hover:border-slate-300 dark:hover:border-slate-600',
          active: 'ring-2 ring-slate-400 border-slate-400',
          iconBg: 'bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <button
      onClick={onClick}
      className={`text-left w-full p-4 rounded-2xl border backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
        theme.bg
      } ${theme.hover} ${isActive ? theme.active : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${theme.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
          {count}
        </span>
      </div>
    </button>
  );
};

export default StatsCard;
