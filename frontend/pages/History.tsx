
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { List, Star, Trash, Funnel } from 'phosphor-react';
import { ScanHistoryItem, ApiProvider } from '../types.ts';
import ResultCard from '../components/ResultCard.tsx'; // Re-use for displaying details if needed
import { useToast } from '../hooks/useToast.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

// Mock data generation
const generateMockHistory = (count: number): ScanHistoryItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `hist-${Date.now() + i}`,
    title: `Scanned Item ${i + 1}`,
    description: `This was item number ${i + 1} scanned via a mock API. It could be anything!`,
    value: `$${Math.floor(Math.random() * 100) + 10} - $${Math.floor(Math.random() * 200) + 110}`,
    aiExplanation: `AI ${ApiProvider.GEMINI} determined this value based on mock criteria. Condition: Good. Rarity: Common. Demand: Moderate.`,
    apiProvider: [ApiProvider.GEMINI, ApiProvider.SERPAPI, ApiProvider.SEARCHAPI][i % 3],
    timestamp: Date.now() - i * 1000 * 60 * 60 * 24, // Each item one day older
    imageUrl: `https://picsum.photos/seed/hist${i}/200/150`,
    isFavorite: Math.random() > 0.7,
  }));
};


const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanHistoryItem | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setHistory(generateMockHistory(10));
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
    addToast(history.find(item=>item.id===id)?.isFavorite ? 'Removed from favorites' : 'Added to favorites', 'success');
  };

  const deleteScan = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    addToast('Scan deleted from history', 'info');
    if (selectedScan?.id === id) {
        setSelectedScan(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading scan history..." />
      </div>
    );
  }
  
  if (selectedScan) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 md:p-8"
        >
            <button 
                onClick={() => setSelectedScan(null)}
                className="mb-4 text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
                <List size={20} className="mr-1" /> Back to History
            </button>
            <ResultCard result={selectedScan} />
             <div className="mt-4 flex justify-center gap-4">
                <button 
                    onClick={() => toggleFavorite(selectedScan.id)}
                    className={`p-2 rounded-full transition-colors ${selectedScan.isFavorite ? 'bg-yellow-400 text-white' : 'bg-secondary-200 dark:bg-secondary-700 hover:bg-yellow-200'}`}
                >
                    <Star size={24} weight={selectedScan.isFavorite ? "fill" : "regular"} />
                </button>
                <button 
                    onClick={() => deleteScan(selectedScan.id)}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                    <Trash size={24} />
                </button>
            </div>
        </motion.div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-100 flex items-center">
            <List size={32} className="mr-3 text-primary-500" /> Scan History
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">Review your past analysis results.</p>
        </div>
        <button className="p-2 rounded-md hover:bg-secondary-200 dark:hover:bg-secondary-700">
            <Funnel size={24} className="text-secondary-700 dark:text-secondary-300" />
        </button>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-10">
          <List size={48} className="text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
          <p className="text-xl text-secondary-600 dark:text-secondary-400">No scans in your history yet.</p>
          <p className="text-secondary-500 dark:text-secondary-500">Start analyzing items to see them here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white dark:bg-secondary-800 shadow-lg rounded-lg p-4 flex items-start gap-4 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedScan(item)}
            >
              <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">{item.title}</h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {new Date(item.timestamp).toLocaleDateString()} - {item.apiProvider}
                </p>
                <p className="text-lg font-bold text-secondary-700 dark:text-secondary-200 mt-1">{item.value}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate mt-1">{item.description}</p>
              </div>
              <div className="flex flex-col space-y-2 items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                  className={`p-2 rounded-full transition-colors ${item.isFavorite ? 'text-yellow-500' : 'text-secondary-400 hover:text-yellow-400'}`}
                  aria-label={item.isFavorite ? "Unfavorite" : "Favorite"}
                >
                  <Star size={24} weight={item.isFavorite ? "fill" : "regular"} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteScan(item.id); }}
                  className="p-2 rounded-full text-red-500 hover:text-red-700"
                  aria-label="Delete scan"
                >
                  <Trash size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPage;