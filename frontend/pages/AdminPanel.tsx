
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, ChartBar, Gear, Bell } from 'phosphor-react';

const AdminPanelPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen"
    >
      <ShieldCheck size={64} className="text-primary-500 mb-4" />
      <h1 className="text-4xl font-bold text-secondary-800 dark:text-secondary-100 mb-2">Admin Panel</h1>
      <p className="text-xl text-secondary-600 dark:text-secondary-400 mb-8">This area is restricted to administrators.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md flex items-center">
            <Users size={32} className="text-blue-500 mr-4" />
            <div>
                <h2 className="text-lg font-semibold">User Management</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">View and manage user accounts.</p>
            </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md flex items-center">
            <ChartBar size={32} className="text-green-500 mr-4" />
            <div>
                <h2 className="text-lg font-semibold">Analytics</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">View application usage statistics.</p>
            </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md flex items-center">
            <Gear size={32} className="text-purple-500 mr-4" />
            <div>
                <h2 className="text-lg font-semibold">System Settings</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Configure application settings.</p>
            </div>
        </div>
         <div className="bg-white dark:bg-secondary-800 p-6 rounded-lg shadow-md flex items-center">
            <Bell size={32} className="text-yellow-500 mr-4" />
            <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Send system-wide announcements.</p>
            </div>
        </div>
      </div>
      <p className="mt-12 text-sm text-secondary-500 dark:text-secondary-400">
        Further development is required to implement admin functionalities.
      </p>
    </motion.div>
  );
};

export default AdminPanelPage;