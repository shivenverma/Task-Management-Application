import React, { useState } from 'react';
import { LogOut, Kanban, User, Menu, X, Plus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { setIsCreateModalOpen } = useTask();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Kanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-slate-100">
                Kanban<span className="text-brand-600 dark:text-brand-500">.</span>
              </span>
              <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-md border border-brand-500/20">
                Pro
              </span>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white bg-slate-200/80 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/60 transition-all"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-800" />

            {/* User Profile Badge */}
            <div className="flex items-center gap-3 bg-slate-200/80 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center border border-brand-500/30">
                {user?.name?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name || 'User'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="p-2 bg-brand-600 text-white rounded-xl shadow-md"
              title="Create Task"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-slide-up">
          <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsCreateModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Task
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
