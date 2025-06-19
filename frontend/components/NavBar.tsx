import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem } from '../types.ts';

interface NavBarProps {
  navItems: NavItem[];
}

const NavBar: React.FC<NavBarProps> = ({ navItems }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-secondary-50 dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 shadow-top flex justify-around p-2">
      {navItems.filter(item => !item.desktopOnly).map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 rounded-md transition-colors duration-200 ease-in-out
             ${isActive 
               ? 'text-primary-500' 
               : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-500 dark:hover:text-primary-400'
             }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={28} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-xs mt-1">{item.name}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;