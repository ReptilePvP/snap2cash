
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext.tsx';
import { ThemeContextType } from '../types.ts';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};