
import React from 'react';
import { ApiProvider } from '../types.ts';
import { analyzeImageWithGemini } from '../services/geminiApiService.ts'; // Updated import
import AnalysisPageBase from './AnalysisPageBase.tsx';
import { Brain } from 'phosphor-react'; // Gemini Icon

const AnalyzeGeminiPage: React.FC = () => {
  return (
    <AnalysisPageBase
      apiProvider={ApiProvider.GEMINI}
      analyzeFunction={analyzeImageWithGemini} // Use the real API function
      pageTitle="Gemini AI Analysis"
      pageDescription="Leverage Google's advanced Gemini model to get insights and valuation for your item."
      apiIcon={Brain}
    />
  );
};

export default AnalyzeGeminiPage;