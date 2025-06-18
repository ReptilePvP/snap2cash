import React from 'react';
import { ApiProvider } from '../types.ts';
import { analyzeImageWithSearchAPI } from '../services/searchApiService.ts'; // Updated import
import AnalysisPageBase from './AnalysisPageBase.tsx';
import { MagnifyingGlass } from 'phosphor-react'; // SearchAPI Icon

const AnalyzeSearchAPIPage: React.FC = () => {
  return (
    <AnalysisPageBase
      apiProvider={ApiProvider.SEARCHAPI}
      analyzeFunction={analyzeImageWithSearchAPI} // Use the real API function
      pageTitle="SearchAPI Google Lens Analysis"
      pageDescription="Utilize a SearchAPI provider's Google Lens to gather comparable listings and estimate your item's value. (Note: Implementation details depend on the specific SearchAPI service used)."
      apiIcon={MagnifyingGlass}
    />
  );
};

export default AnalyzeSearchAPIPage;
