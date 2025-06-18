
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LiveScanner from '../components/LiveScanner.tsx';
import ResultCard from '../components/ResultCard.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import { AnalysisResult, ApiProvider } from '../types.ts';
import { analyzeImageWithGemini } from '../services/geminiApiService.ts'; // Updated import
import { useToast } from '../hooks/useToast.ts';
import { ArrowClockwise, Camera } from 'phosphor-react';

const LiveAnalysisPage: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleScanComplete = async (imageDataUrl: string) => {
    setCapturedImageUrl(imageDataUrl); 
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // imageDataUrl is a base64 string
      const result = await analyzeImageWithGemini(imageDataUrl, imageDataUrl); // Use real API
      setAnalysisResult(result);
      addToast('Live analysis complete!', 'success');
    } catch (err) {
      console.error('Error during live analysis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze live image.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    setCapturedImageUrl(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-8 flex flex-col items-center"
    >
      <header className="w-full max-w-3xl text-center mb-8">
        <div className="flex items-center justify-center mb-2">
            <Camera size={40} className="text-primary-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-800 dark:text-secondary-100">Live Item Analysis</h1>
        </div>
        <p className="text-secondary-600 dark:text-secondary-400">
          Point your camera at an item and capture an image for instant AI valuation using Gemini.
        </p>
      </header>

      {!analysisResult && !isAnalyzing && (
        <LiveScanner onScanComplete={handleScanComplete} />
      )}

      {isAnalyzing && (
        <div className="my-10 text-center">
            <LoadingSpinner size="lg" message="Analyzing live image with Gemini, please wait..." />
            {capturedImageUrl && <img src={capturedImageUrl} alt="Captured for analysis" className="mt-4 rounded-lg shadow-md max-w-xs mx-auto"/>}
        </div>
      )}
      
      {error && (
        <motion.div 
            initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
            className="my-4 p-4 bg-red-100 dark:bg-red-800/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-center w-full max-w-xl"
        >
          <p className="font-semibold">Analysis Error:</p>
          <p className="text-sm">{error}</p>
          <button 
             onClick={resetAnalysis}
             className="mt-3 px-3 py-1.5 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            Try again
          </button>
        </motion.div>
      )}

      {analysisResult && (
         <div className="w-full">
            <ResultCard result={{...analysisResult, imageUrl: capturedImageUrl || analysisResult.imageUrl }} />
            <div className="text-center mt-6">
                <button
                onClick={resetAnalysis}
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center mx-auto"
                >
                    <ArrowClockwise size={20} className="mr-2" /> Scan Another Item
                </button>
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default LiveAnalysisPage;