
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AnalysisResult } from '../types.ts';
import { motion } from 'framer-motion';
import { Tag, TextIndent, Money, Lightbulb, ImageSquare } from 'phosphor-react';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-secondary-800 shadow-xl rounded-lg p-6 w-full max-w-2xl mx-auto my-4 overflow-hidden"
    >
      {result.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden h-64">
           <img src={result.imageUrl} alt={result.title} className="w-full h-full object-contain" />
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <Tag size={24} className="text-primary-500 mr-2" />
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-100">{result.title}</h2>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-1">
          <TextIndent size={20} className="mr-2" />
          <span>Description</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-secondary-700 dark:text-secondary-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{result.description}</ReactMarkdown>
        </div>
      </div>

      <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
        <div className="flex items-center text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1">
          <Money size={24} className="mr-2" />
          <span>Estimated Value:</span>
        </div>
        <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{result.value}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            <Lightbulb size={20} className="mr-2" />
            <span>AI Explanation</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-secondary-700 dark:text-secondary-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{result.aiExplanation}</ReactMarkdown>
        </div>
      </div>

      {result.visualMatches && result.visualMatches.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            <ImageSquare size={20} className="mr-2" />
            <span>Top Visual Matches</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.visualMatches.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-secondary-50 dark:bg-secondary-700/50 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-all duration-200 overflow-hidden"
              >
                <div className="w-full h-32 bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnail})` }}></div>
                <div className="p-3">
                  <div className="flex items-center">
                    {item.source_icon && <img src={item.source_icon} alt="" className="w-4 h-4 mr-2" />}
                    <span className="text-sm font-medium text-secondary-800 dark:text-secondary-200 truncate">{item.title}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {result.imageCompare && (
        <div className="mt-6">
          <div className="flex items-center text-sm text-secondary-600 dark:text-secondary-400 mb-1">
            <ImageSquare size={20} className="mr-2" />
            <span>Comparison Image</span>
          </div>
          <img src={result.imageCompare} alt="Comparison" className="rounded-lg shadow-md w-full object-contain max-h-80" />
        </div>
      )}
      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-4 text-right">Analyzed by: {result.apiProvider}</p>
    </motion.div>
  );
};

export default ResultCard;