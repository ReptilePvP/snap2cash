
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SmileyXEyes, House } from 'phosphor-react';

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-secondary-100 dark:bg-secondary-900"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
          y: [0, -15, 0, -15, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <SmileyXEyes size={128} className="text-primary-500 mb-8" />
      </motion.div>
      
      <h1 className="text-6xl font-extrabold text-secondary-800 dark:text-secondary-100 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-secondary-700 dark:text-secondary-300 mb-6">Oops! Page Not Found.</h2>
      <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. 
        Don't worry, let's get you back on track!
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-primary-700 transition-colors duration-300 transform hover:scale-105"
      >
        <House size={24} className="mr-2" />
        Go to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;