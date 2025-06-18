import React from 'react';
import { ApiProvider } from '../types.ts';
import { analyzeImageWithSerpAPI } from '../services/serpApiService.ts'; // Updated import
import AnalysisPageBase from './AnalysisPageBase.tsx';
import { Cloud } from 'phosphor-react'; // SerpAPI Icon

const AnalyzeSerpAPIPage: React.FC = () => {
  const serpApiAnalysis = (imageSource: string | File, displayImageUrl: string) => {
    if (typeof imageSource !== 'string') {
      // SerpAPI only works with URLs, not file uploads directly from this page.
      return Promise.reject(new Error("SerpAPI analysis requires an image URL."));
    }
    return analyzeImageWithSerpAPI(imageSource, displayImageUrl);
  };

  return (
    <AnalysisPageBase
      apiProvider={ApiProvider.SERPAPI}
      analyzeFunction={serpApiAnalysis}
      pageTitle="SerpAPI Google Lens Analysis"
      pageDescription="Get market-driven resale insights by analyzing product data with SerpAPI's Google Lens."
      apiIcon={Cloud}
    />
  );
};

export default AnalyzeSerpAPIPage;
