
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ImageUpload from '../components/ImageUpload.tsx';
import ResultCard from '../components/ResultCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { AnalysisResult, ApiProvider } from '../types.ts';
import APISelector from '../components/APISelector.tsx';
import { useToast } from '../hooks/useToast.ts';
import { ArrowLeft, ArrowClockwise } from 'phosphor-react';

interface AnalysisPageBaseProps {
  apiProvider: ApiProvider;
  analyzeFunction: (imageSource: File | string, displayImageUrl: string) => Promise<AnalysisResult>;
  pageTitle: string;
  pageDescription: string;
  apiIcon: React.ElementType;
}

const AnalysisPageBase: React.FC<AnalysisPageBaseProps> = ({ 
  apiProvider, 
  analyzeFunction,
  pageTitle,
  pageDescription,
  apiIcon: ApiIconComponent
}) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Removed uploadedImageFile as the backend handles the file itself
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { addToast } = useToast();

  // New handler for when ImageUpload successfully uploads to backend and returns URL
  const handleBackendImageUploadSuccess = useCallback((imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setAnalysisResult(null); // Clear previous result
    setError(null);
    addToast('Image uploaded successfully! Ready for analysis.', 'success');
  }, [addToast]);

  // Handlers for ImageUpload's upload start/end states
  const handleUploadStart = useCallback(() => {
    setIsAnalyzing(true); // Use isAnalyzing to indicate upload/analysis in progress
    setError(null);
  }, []);

  const handleUploadEnd = useCallback(() => {
    setIsAnalyzing(false);
  }, []);


  const startAnalysis = async () => {
    if (!uploadedImageUrl) {
      setError('Please upload an image first.');
      addToast('Please upload an image first.', 'error');
      return;
    }
    setIsAnalyzing(true); // Keep true for analysis phase
    setError(null);
    setAnalysisResult(null);

    try {
      // Pass only the GCS URL to the analyze function
      const result = await analyzeFunction(uploadedImageUrl, uploadedImageUrl);
      setAnalysisResult(result);
      addToast(`${apiProvider} analysis complete!`, 'success');
    } catch (err) {
      console.error(`Error analyzing with ${apiProvider}:`, err);
      const errorMessage = err instanceof Error ? err.message : `Failed to analyze image with ${apiProvider}.`;
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    // setUploadedImageFile(null); // Removed
    setUploadedImageUrl(null);
    setError(null);
    setIsAnalyzing(false);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-4 md:p-8 flex flex-col items-center"
    >
      <header className="w-full max-w-3xl text-center mb-8">
        <div className="flex items-center justify-center mb-2">
            <ApiIconComponent size={40} className="text-primary-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 dark:text-secondary-100">{pageTitle}</h1>
        </div>
        <p className="text-secondary-600 dark:text-secondary-400">{pageDescription}</p>
      </header>

      {!analysisResult && (
        <ImageUpload 
          onBackendImageUploadSuccess={handleBackendImageUploadSuccess} 
          isAnalyzing={isAnalyzing} // Pass isAnalyzing to disable during upload/analysis
          onUploadStart={handleUploadStart}
          onUploadEnd={handleUploadEnd}
        />
      )}
      
      {uploadedImageUrl && !analysisResult && !isAnalyzing && ( // Check for uploadedImageUrl
        <motion.button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-150 ease-in-out disabled:opacity-50 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Analyze with {apiProvider}
        </motion.button>
      )}

      {isAnalyzing && (
        <div className="my-10 text-center">
            <LoadingSpinner size="lg" message={`Analyzing with ${apiProvider}, please wait...`} />
        </div>
      )}

      {error && (
        <motion.div 
            initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
            className="my-4 p-4 bg-red-100 dark:bg-red-800/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-center"
        >
          <p>{error}</p>
          <button 
             onClick={resetAnalysis}
             className="mt-2 text-sm text-primary-600 hover:underline dark:text-primary-400"
          >
            Try again
          </button>
        </motion.div>
      )}

      {analysisResult && (
        <div className="w-full">
            <ResultCard result={analysisResult} />
            <div className="text-center mt-6">
                <button
                onClick={resetAnalysis}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center mx-auto"
                >
                    <ArrowClockwise size={20} className="mr-2" /> Analyze Another Image
                </button>
            </div>
        </div>
      )}
      
      <div className="mt-12 w-full max-w-3xl">
        <APISelector currentApi={apiProvider} />
      </div>
       <button onClick={() => window.history.back()} className="mt-8 text-primary-600 dark:text-primary-400 hover:underline flex items-center">
            <ArrowLeft size={20} className="mr-1" /> Back to previous page
       </button>
    </motion.div>
  );
};

export default AnalysisPageBase;
