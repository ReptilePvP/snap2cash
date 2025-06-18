
import React from 'react';
import { motion } from 'framer-motion';
import { ChartPieSlice, Scan, Star, UserCircle, Target } from 'phosphor-react';
import { Link } from 'react-router-dom';
import APISelector from '../components/APISelector.tsx';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <motion.div 
    className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-lg flex items-center space-x-4"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="p-3 bg-primary-100 dark:bg-primary-500/20 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">{title}</p>
      <p className="text-2xl font-bold text-secondary-800 dark:text-secondary-100">{value}</p>
    </div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const preferredApi = 'Gemini'; // Mock data
  const totalScans = 28; // Mock data
  const savedItems = 5; // Mock data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 md:p-8"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-100">Welcome back, User!</h1>
        <p className="text-secondary-600 dark:text-secondary-400">Here's an overview of your Snap2Cash activity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Scans" value={totalScans.toString()} icon={<Scan size={32} className="text-primary-500" />} />
        <StatCard title="Saved Items" value={savedItems.toString()} icon={<Star size={32} className="text-yellow-500" />} />
        <StatCard title="Preferred API" value={preferredApi} icon={<Target size={32} className="text-green-500" />} />
      </div>
      
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/live-analysis" className="flex-1 text-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors">
                Start New Live Scan
            </Link>
             <Link to="/analyze/gemini" className="flex-1 text-center bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors">
                Upload & Analyze
            </Link>
        </div>
      </div>

      <div className="mt-8">
        <APISelector />
      </div>
      
      <div className="mt-8 bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-100 mb-4">Recent Activity (Mock)</h2>
        <ul className="space-y-3">
          {['Vintage Lamp Scan', 'Old Book Valuation', 'Sneaker Price Check'].map((item, index) => (
            <li key={index} className="flex justify-between items-center p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <span className="text-secondary-700 dark:text-secondary-300">{item}</span>
              <span className="text-sm text-secondary-500 dark:text-secondary-400">2 days ago</span>
            </li>
          ))}
        </ul>
        <Link to="/history" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-block">
          View all history &rarr;
        </Link>
      </div>

    </motion.div>
  );
};

export default DashboardPage;