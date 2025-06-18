
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiProvider } from '../types.ts';
import { Brain, Cloud, MagnifyingGlass } from 'phosphor-react'; // Example icons

interface APISelectorProps {
  currentApi?: ApiProvider;
}

const apiOptions = [
  { name: ApiProvider.GEMINI, path: '/analyze/gemini', icon: Brain, description: "Advanced analysis with Google's Gemini." },
  { name: ApiProvider.SERPAPI, path: '/analyze/serpapi', icon: Cloud, description: "Market insights using SerpAPI." },
  { name: ApiProvider.SEARCHAPI, path: '/analyze/searchapi', icon: MagnifyingGlass, description: "Value estimation via SearchAPI." },
];

const APISelector: React.FC<APISelectorProps> = ({ currentApi }) => {
  const navigate = useNavigate();

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-4 text-center text-secondary-700 dark:text-secondary-300">Choose an Analysis Engine</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {apiOptions.map((api) => (
          <button
            key={api.name}
            onClick={() => navigate(api.path)}
            disabled={api.name === currentApi}
            className={`p-6 rounded-lg shadow-lg text-left transition-all duration-200 ease-in-out transform hover:scale-105
                        ${api.name === currentApi 
                          ? 'bg-primary-500 text-white ring-2 ring-primary-300 ring-offset-2 ring-offset-secondary-100 dark:ring-offset-secondary-900' 
                          : 'bg-white dark:bg-secondary-800 hover:bg-primary-50 dark:hover:bg-secondary-700'
                        }
                        disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100`}
          >
            <div className="flex items-center mb-2">
              <api.icon size={28} className={`mr-3 ${api.name === currentApi ? 'text-white' : 'text-primary-500'}`} />
              <span className="text-lg font-bold">{api.name}</span>
            </div>
            <p className={`text-sm ${api.name === currentApi ? 'text-primary-100' : 'text-secondary-600 dark:text-secondary-400'}`}>
              {api.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default APISelector;