
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Brain, Tag, Sparkle, Scan, List, Star, Cpu, ArrowRight, Lightbulb, IconProps } from 'phosphor-react';
import { APP_NAME } from '../constants.ts';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay?: number }> = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
  >
    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-full mb-4 text-primary-500">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-100 mb-2">{title}</h3>
    <p className="text-secondary-600 dark:text-secondary-400 text-sm">{description}</p>
  </motion.div>
);

interface StepCardProps {
  icon: React.ReactElement<IconProps>;
  title: string;
  description: string;
  stepNumber: number;
  delay?: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, stepNumber, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay }}
        className="flex items-start space-x-4 p-4"
    >
        <div className="flex-shrink-0">
            <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-500 text-white rounded-full text-xl font-bold">
                    {stepNumber}
                </div>
                <div className="absolute -top-2 -left-2 text-primary-500 bg-white dark:bg-secondary-800 p-1 rounded-full shadow-md">
                     {React.cloneElement(icon, { size: 24 })}
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-100 mb-1">{title}</h3>
            <p className="text-secondary-600 dark:text-secondary-400">{description}</p>
        </div>
    </motion.div>
);


const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary-50 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200"
    >
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Lightbulb size={64} className="mx-auto mb-6 text-yellow-300" weight="fill" />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Unlock the Value of Your Items Instantly
            </h1>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-primary-100 dark:text-primary-200">
              {APP_NAME} uses cutting-edge AI to estimate the resale value of your belongings.
              Just snap a photo or scan live for quick insights!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="bg-white text-primary-600 dark:bg-yellow-400 dark:text-secondary-900 font-bold py-4 px-10 rounded-lg shadow-xl hover:bg-opacity-90 dark:hover:bg-yellow-300 transition-all duration-300 text-lg inline-flex items-center"
              >
                Get Started <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h2 
            initial={{ opacity:0, y:20 }} animate={{opacity:1, y:0}} transition={{delay:0.2}}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-secondary-800 dark:text-secondary-100"
          >
            Simple Steps to Valuation
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12 items-start">
            <StepCard
              stepNumber={1}
              icon={<Camera />}
              title="Snap or Upload"
              description="Easily upload a photo or use our live camera to scan your item in seconds."
              delay={0.3}
            />
            <StepCard
              stepNumber={2}
              icon={<Brain />}
              title="AI Analysis"
              description="Our powerful AI engines (Gemini, SerpAPI, etc.) analyze your item's visual details and features."
              delay={0.5}
            />
            <StepCard
              stepNumber={3}
              icon={<Tag />}
              title="Get Estimate"
              description="Receive a detailed valuation, market insights, and AI-driven explanations for its worth."
              delay={0.7}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary-100 dark:bg-secondary-800/30">
        <div className="container mx-auto px-6">
          <motion.h2 
             initial={{ opacity:0, y:20 }} animate={{opacity:1, y:0}} transition={{delay:0.2}}
            className="text-3xl md:text-4xl font-bold text-center mb-16 text-secondary-800 dark:text-secondary-100"
          >
            Powerful Features at Your Fingertips
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Cpu size={32} />}
              title="Multiple AI Engines"
              description="Choose from leading AI providers like Gemini for diverse and comprehensive insights."
              delay={0.3}
            />
            <FeatureCard
              icon={<Scan size={32} />}
              title="Live Camera Scan"
              description="Instant analysis with our real-time camera scanning feature. Point, shoot, and value!"
              delay={0.4}
            />
            <FeatureCard
              icon={<List size={32} />}
              title="Detailed History"
              description="Keep track of all your past scans and valuations for easy reference and comparison."
              delay={0.5}
            />
            <FeatureCard
              icon={<Star size={32} />}
              title="Save Favorites"
              description="Bookmark important or valuable items for quick access to their analysis anytime."
              delay={0.6}
            />
            <FeatureCard
                icon={<Sparkle size={32} />}
                title="AI-Powered Insights"
                description="Understand the 'why' behind the valuation with clear explanations from our AI models."
                delay={0.7}
            />
             <FeatureCard
                icon={<Lightbulb size={32} />}
                title="User-Friendly Interface"
                description="Enjoy a seamless and intuitive experience, designed for ease of use on all devices."
                delay={0.8}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkle size={56} className="mx-auto mb-6 text-yellow-300" weight="fill" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Discover Your Item's Worth?
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-primary-100 dark:text-primary-200">
              Join thousands of users who trust {APP_NAME} for quick and reliable resale estimations.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <Link
              to="/analyze/gemini" // Or /dashboard
              className="bg-yellow-400 text-secondary-900 font-bold py-4 px-10 rounded-lg shadow-xl hover:bg-yellow-300 transition-all duration-300 text-lg inline-flex items-center"
            >
              Analyze Your First Item <ArrowRight size={20} className="ml-2" />
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="py-8 text-center bg-secondary-200 dark:bg-secondary-950">
        <p className="text-secondary-600 dark:text-secondary-400 text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </footer>
    </motion.div>
  );
};

export default HomePage;
