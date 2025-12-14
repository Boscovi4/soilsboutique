import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    success: 'bg-primary text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-secondary text-white'
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[150] flex items-center gap-2 px-6 py-3 rounded-full shadow-lg shadow-black/20 animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColors[type]}`}>
      <span className="material-icons text-sm">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};