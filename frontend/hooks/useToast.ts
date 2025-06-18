
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext.tsx';
import { ToastContextType } from '../types.ts';

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};