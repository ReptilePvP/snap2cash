import { AnalysisResult, ApiProvider } from '../types';

// Note: This is a simplified version for mobile
// You'll need to implement the actual Gemini API integration
// Consider using your backend API instead of direct client calls for security

interface GeminiResponse {
  itemName: string;
  itemDescription: string;
  estimatedValue: string;
  valuationRationale: string;
}

export const analyzeImageWithGemini = async (
  imageDataUrl: string,
  displayImageUrl: string
): Promise<AnalysisResult> => {
  // For now, return mock data
  // In production, you should call your backend API
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
  
  const mockResponse: GeminiResponse = {
    itemName: "Analyzed Item",
    itemDescription: "This appears to be a valuable item based on visual analysis. The condition looks good with no visible damage.",
    estimatedValue: "$25 - $75",
    valuationRationale: "The estimated value is based on visual characteristics, apparent condition, and general market trends for similar items. Further inspection may be needed for precise valuation."
  };

  return {
    id: `gemini-${Date.now()}`,
    title: mockResponse.itemName,
    description: mockResponse.itemDescription,
    value: mockResponse.estimatedValue,
    aiExplanation: mockResponse.valuationRationale,
    imageUrl: displayImageUrl,
    apiProvider: ApiProvider.GEMINI,
    timestamp: Date.now(),
  };
};