
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.tsx';
import NavBar from './NavBar.tsx';
import { NavItem } from '../types.ts';
import { House, ChartBar, Camera, MagnifyingGlass, Gear, Users, List, Star, UserCircle, SignIn as SignInIcon, UserPlus } from 'phosphor-react';
import { ThemeProvider } from '../contexts/ThemeContext.tsx';
import { ToastProvider } from '../contexts/ToastContext.tsx';

const navItems: NavItem[] = [
  { path: '/', name: 'Home', icon: House },
  { path: '/dashboard', name: 'Dashboard', icon: ChartBar },
  { path: '/analyze/gemini', name: 'Gemini AI', icon: MagnifyingGlass }, // Placeholder icon
  { path: '/analyze/serpapi', name: 'SerpAPI', icon: MagnifyingGlass }, // Placeholder icon
  { path: '/analyze/searchapi', name: 'SearchAPI', icon: MagnifyingGlass }, // Placeholder icon
  { path: '/live-analysis', name: 'Live Scan', icon: Camera },
  { path: '/history', name: 'History', icon: List },
  { path: '/saved', name: 'Saved', icon: Star },
  { path: '/account-settings', name: 'Settings', icon: Gear },
  { path: '/admin', name: 'Admin', icon: Users, desktopOnly: true }, // Example desktop only
  { path: '/signin', name: 'Sign In', icon: SignInIcon, mobileOnly: true}, // Example mobile only
  { path: '/create-account', name: 'Sign Up', icon: UserPlus, mobileOnly: true}, // Example mobile only
];


const Layout: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="flex h-screen">
          <Sidebar navItems={navItems} />
          <main className="flex-1 md:ml-64 overflow-y-auto bg-secondary-100 dark:bg-secondary-900 pb-16 md:pb-0">
            <Outlet /> {/* This is where routed page components will render */}
          </main>
          <NavBar navItems={navItems} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default Layout;