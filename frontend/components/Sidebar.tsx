
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types.ts';
import { APP_NAME } from '../constants.ts';
import { Package } from 'phosphor-react'; // Example Icon
import ThemeToggle from './ThemeToggle.tsx';

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-secondary-50 dark:bg-secondary-800 shadow-lg h-screen fixed">
      <div className="flex items-center justify-center h-20 border-b border-secondary-200 dark:border-secondary-700">
        <Package size={32} className="text-primary-500 mr-2" />
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">{APP_NAME}</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.filter(item => !item.mobileOnly).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ease-in-out
               ${isActive 
                 ? 'bg-primary-500 text-white shadow-md' 
                 : 'text-secondary-700 dark:text-secondary-300 hover:bg-primary-100 dark:hover:bg-secondary-700'
               }`
            }
          >
            <item.icon size={24} className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;