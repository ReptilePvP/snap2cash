
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Envelope, Lock, User } from 'phosphor-react';
import { APP_NAME } from '../constants.ts';
import { useToast } from '../hooks/useToast.ts';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast('Passwords do not match!', 'error');
      return;
    }
    setIsLoading(true);
    // Mock account creation
    setTimeout(() => {
      setIsLoading(false);
      addToast('Account created successfully! Please sign in.', 'success');
      navigate('/signin');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center p-4 bg-secondary-100 dark:bg-secondary-900"
    >
      <div className="w-full max-w-md bg-white dark:bg-secondary-800 shadow-xl rounded-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <UserPlus size={48} className="text-primary-500 mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-secondary-800 dark:text-secondary-100">Create Account</h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">Join {APP_NAME} today!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Full Name</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} className="text-secondary-400" />
                </div>
                <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500" placeholder="John Doe" />
            </div>
          </div>
          <div>
            <label htmlFor="email_create" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Email address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Envelope size={20} className="text-secondary-400" />
                </div>
                <input id="email_create" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="password_create" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-secondary-400" />
                </div>
                <input id="password_create" name="password_create" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500" placeholder="••••••••" />
            </div>
          </div>
           <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Confirm Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-secondary-400" />
                </div>
                <input id="confirm_password" name="confirm_password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-secondary-300 dark:border-secondary-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <button type="submit" disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:focus:ring-offset-secondary-800">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-secondary-600 dark:text-secondary-400">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default CreateAccountPage;