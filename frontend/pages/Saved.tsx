
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, List, Trash } from 'phosphor-react';
import { ScanHistoryItem, ApiProvider } from '../types.ts'; // Re-use ScanHistoryItem for structure
import ResultCard from '../components/ResultCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { useToast } from '../hooks/useToast.ts';


const generateMockSavedItems = (count: number): ScanHistoryItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `saved-${Date.now() + i}`,
    title: `Favorite Item ${i + 1}`,
    description: `This special item ${i + 1} was saved. It's truly unique!`,
    value: `$${Math.floor(Math.random() * 200) + 50} - $${Math.floor(Math.random() * 300) + 250}`,
    aiExplanation: `AI ${ApiProvider.GEMINI} marked this as a high-value item based on its unique mock characteristics.`,
    apiProvider: ApiProvider.GEMINI,
    timestamp: Date.now() - i * 1000 * 60 * 60 * 48, // Each item two days older
    imageUrl: `https://picsum.photos/seed/saved${i}/200/150`,
    isFavorite: true, // All items here are favorites
  }));
};

const SavedPage: React.FC = () => {
  const [savedItems, setSavedItems] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSavedItems(generateMockSavedItems(5));
      setIsLoading(false);
    }, 1000);
  }, []);

  const removeFromSaved = (id: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from saved list.', 'info');
    if (selectedItem?.id === id) {
        setSelectedItem(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading saved items..." />
      </div>
    );
  }

  if (selectedItem) {
    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 md:p-8"
        >
            <button 
                onClick={() => setSelectedItem(null)}
                className="mb-4 text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
                <Star size={20} className="mr-1" /> Back to Saved Items
            </button>
            <ResultCard result={selectedItem} />
             <div className="mt-4 flex justify-center">
                <button 
                    onClick={() => removeFromSaved(selectedItem.id)}
                    className="p-2 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center"
                >
                    <Trash size={20} className="mr-2" /> Remove from Saved
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-100 flex items-center">
          <Star size={32} weight="fill" className="mr-3 text-yellow-400" /> Saved Items
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">Your collection of favorite analysis results.</p>
      </header>

      {savedItems.length === 0 ? (
        <div className="text-center py-10">
          <Star size={48} className="text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
          <p className="text-xl text-secondary-600 dark:text-secondary-400">No items saved yet.</p>
          <p className="text-secondary-500 dark:text-secondary-500">Mark items as favorite in your history to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-secondary-800 shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">{item.title}</h3>
                <p className="text-lg font-bold text-secondary-700 dark:text-secondary-200 mt-1">{item.value}</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate mt-1">{item.apiProvider} - {new Date(item.timestamp).toLocaleDateString()}</p>
                 <button 
                  onClick={(e) => { e.stopPropagation(); removeFromSaved(item.id); }}
                  className="mt-3 w-full text-sm text-red-500 hover:text-red-700 p-2 rounded-md bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-800/70 transition-colors"
                  aria-label="Remove from saved"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SavedPage;