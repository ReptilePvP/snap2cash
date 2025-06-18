
import React from 'react';
import { Sun, Moon } from 'phosphor-react';
import { useTheme } from '../hooks/useTheme.ts';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon size={24} className="text-secondary-700" />
      ) : (
        <Sun size={24} className="text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;