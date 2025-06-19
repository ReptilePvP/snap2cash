import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NavItem } from '../types.ts';
import { APP_NAME } from '../constants.ts';
import { Package, SignOut } from 'phosphor-react';
import ThemeToggle from './ThemeToggle.tsx';
import { authService } from '../services/authService.ts';
import { useToast } from '../hooks/useToast.ts';

interface SidebarProps {
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ navItems }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  const handleSignOut = async () => {
    try {
      await authService.logout();
      addToast('Signed out successfully', 'success');
      navigate('/');
    } catch (error) {
      addToast('Error signing out', 'error');
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-secondary-50 dark:bg-secondary-800 shadow-lg h-screen fixed">
      <div className="flex items-center justify-center h-20 border-b border-secondary-200 dark:border-secondary-700">
        <Package size={32} className="text-primary-500 mr-2" />
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">{APP_NAME}</h1>
      </div>
      
      {isAuthenticated && user && (
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200">{user.name}</p>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}

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
      
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700 space-y-3">
        <ThemeToggle />
        {isAuthenticated && (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 ease-in-out"
          >
            <SignOut size={24} className="mr-3" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;