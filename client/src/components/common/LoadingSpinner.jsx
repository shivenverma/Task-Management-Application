import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ label = 'Loading tasks...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-9 h-9 text-brand-500 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-400 animate-pulse">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
