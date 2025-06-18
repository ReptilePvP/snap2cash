
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastMessage } from '../types.ts';
import { CheckCircle, XCircle, Info } from 'phosphor-react';

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[toast.type];

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`fixed bottom-5 right-5 z-50 flex items-center p-4 mb-4 text-white ${bgColor} rounded-lg shadow-lg w-full max-w-xs`}
      role="alert"
    >
      <Icon size={24} weight="bold" className="mr-3" />
      <div className="text-sm font-medium">{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-white rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-white/20 focus:ring-2 focus:ring-white/30"
        aria-label="Close"
      >
        <XCircle size={20} />
      </button>
    </motion.div>
  );
};


interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;