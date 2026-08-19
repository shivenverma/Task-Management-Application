import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type } = toast;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return 'border-rose-500/40 bg-rose-950/80 text-rose-100';
      case 'info':
        return 'border-sky-500/40 bg-sky-950/80 text-sky-100';
      case 'success':
      default:
        return 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl ${getBorderColor()}`}
      >
        {getIcon()}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors ml-auto text-slate-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
