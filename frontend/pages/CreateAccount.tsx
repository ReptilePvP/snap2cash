import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Envelope, Lock, User, Eye, EyeSlash } from 'phosphor-react';
import { APP_NAME } from '../constants.ts';
import { useToast } from '../hooks/useToast.ts';
import { authService } from '../services/authService.ts';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
    general?: string;
  }>({});
  const navigate = useNavigate();
  const { addToast } = useToast();

  const validateForm = () => {
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.register({ 
        name: name.trim(), 
        email, 
        password 
      });
      
      if (result.success) {
        addToast('Account created successfully! Welcome to Snap2Cash!', 'success');
        navigate('/dashboard');
      } else {
        setErrors({ general: result.message || 'Account creation failed' });
        addToast(result.message || 'Account creation failed', 'error');
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setErrors({ general: errorMessage });
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
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

        {errors.general && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="text-secondary-400" />
              </div>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                value={name} 
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 ${
                  errors.name ? 'border-red-500 dark:border-red-400' : 'border-secondary-300 dark:border-secondary-600'
                }`}
                placeholder="John Doe" 
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email_create" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Envelope size={20} className="text-secondary-400" />
              </div>
              <input 
                id="email_create" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 ${
                  errors.email ? 'border-red-500 dark:border-red-400' : 'border-secondary-300 dark:border-secondary-600'
                }`}
                placeholder="you@example.com" 
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password_create" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-secondary-400" />
              </div>
              <input 
                id="password_create" 
                name="password_create" 
                type={showPassword ? 'text' : 'password'}
                required 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                }}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 ${
                  errors.password ? 'border-red-500 dark:border-red-400' : 'border-secondary-300 dark:border-secondary-600'
                }`}
                placeholder="••••••••" 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlash size={20} className="text-secondary-400 hover:text-secondary-600" />
                ) : (
                  <Eye size={20} className="text-secondary-400 hover:text-secondary-600" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-secondary-400" />
              </div>
              <input 
                id="confirm_password" 
                name="confirm_password" 
                type={showConfirmPassword ? 'text' : 'password'}
                required 
                value={confirmPassword} 
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 ${
                  errors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-secondary-300 dark:border-secondary-600'
                }`}
                placeholder="••••••••" 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlash size={20} className="text-secondary-400 hover:text-secondary-600" />
                ) : (
                  <Eye size={20} className="text-secondary-400 hover:text-secondary-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-secondary-800"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
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