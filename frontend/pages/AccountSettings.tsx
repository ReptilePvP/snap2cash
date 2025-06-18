
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gear, Palette, Lock, Cpu, Envelope, User } from 'phosphor-react';
import ThemeToggle from '../components/ThemeToggle.tsx';
import { ApiProvider } from '../types.ts';
import { useToast } from '../hooks/useToast.ts';

const AccountSettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [defaultApi, setDefaultApi] = useState<ApiProvider>(ApiProvider.GEMINI); // Mocked
  const { addToast } = useToast();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      addToast('New passwords do not match!', 'error');
      return;
    }
    if (newPassword.length < 8) {
        addToast('New password must be at least 8 characters long!', 'error');
        return;
    }
    // Mock password change
    addToast('Password changed successfully (mocked)!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleApiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaultApi(e.target.value as ApiProvider);
    addToast(`Default API set to ${e.target.value}`, 'success');
  };

  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <motion.div 
        className="bg-white dark:bg-secondary-800 shadow-lg rounded-xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="ml-3 text-xl font-semibold text-secondary-800 dark:text-secondary-100">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 max-w-3xl mx-auto"
    >
      <header className="mb-8 text-center">
        <Gear size={48} className="text-primary-500 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-100">Account Settings</h1>
        <p className="text-secondary-600 dark:text-secondary-400">Manage your preferences and account details.</p>
      </header>

      <Section title="Profile Information" icon={<User size={24} className="text-blue-500" />}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Full Name</label>
                <input type="text" defaultValue="John Doe (Mock)" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Email Address</label>
                <input type="email" defaultValue="john.doe@example.com (Mock)" readOnly className="mt-1 block w-full px-3 py-2 bg-secondary-100 dark:bg-secondary-900 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm sm:text-sm cursor-not-allowed" />
            </div>
             <button className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">Save Profile</button>
        </div>
      </Section>

      <Section title="Appearance" icon={<Palette size={24} className="text-purple-500" />}>
        <div className="flex items-center justify-between">
          <p className="text-secondary-700 dark:text-secondary-300">Theme (Dark/Light Mode)</p>
          <ThemeToggle />
        </div>
      </Section>

      <Section title="Change Password" icon={<Lock size={24} className="text-red-500" />}>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required 
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Confirm New Password</label>
            <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} required
                   className="mt-1 block w-full px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
          </div>
          <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            Update Password
          </button>
        </form>
      </Section>

      <Section title="Preferences" icon={<Cpu size={24} className="text-green-500" />}>
        <div>
          <label htmlFor="api-select" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">Default Analysis API</label>
          <select 
            id="api-select" 
            value={defaultApi} 
            onChange={handleApiChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
          >
            <option value={ApiProvider.GEMINI}>Gemini AI</option>
            <option value={ApiProvider.SERPAPI}>SerpAPI</option>
            <option value={ApiProvider.SEARCHAPI}>SearchAPI</option>
          </select>
        </div>
      </Section>
    </motion.div>
  );
};

export default AccountSettingsPage;