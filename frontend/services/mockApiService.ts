import { AnalysisResult, ApiProvider } from '../types.ts';
import { MOCK_API_DELAY } from '../constants.ts';

const createMockAnalysisResult = (apiProvider: ApiProvider, uploadedImageUrl?: string): AnalysisResult => {
  const titles = ["Vintage Leather Jacket", "Retro Gaming Console", "Antique Silver Spoon", "Designer Handbag", "Limited Edition Sneakers"];
  const randomTitle = titles[Math.floor(Math.random() * titles.length)];
  const randomValueMin = Math.floor(Math.random() * 50) + 20;
  const randomValueMax = randomValueMin + Math.floor(Math.random() * 100) + 10;

  return {
    id: `mock-${apiProvider.toLowerCase()}-${Date.now()}`,
    title: randomTitle,
    description: `This is a *high-quality* ${randomTitle.toLowerCase()} that appears to be in **good condition**. It has several distinctive features common to items of its era. Based on current market trends, similar items have sold recently. (Mocked Data)`,
    value: `$${randomValueMin} - $${randomValueMax} (Mocked)`,
    aiExplanation: `The estimated value is based on several factors analyzed by **${apiProvider} AI (Mocked)**:
    - **Item Rarity**: Moderately rare.
    - **Condition**: Appears to be good to very good from the image.
    - **Brand Recognition**: If applicable, brand is well-regarded.
    - **Demand**: Current market demand for such items is moderate to high.
    
    \`\`\`json
    {
      "confidence_score": ${Math.random().toFixed(2)},
      "comparable_listings_found": ${Math.floor(Math.random() * 10) + 3}
    }
    \`\`\`
    Further in-person inspection is recommended for a more precise valuation. (Mocked Data)`,
    imageCompare: Math.random() > 0.5 ? `https://picsum.photos/seed/${Date.now()}/600/400` : undefined,
    imageUrl: uploadedImageUrl || `https://picsum.photos/seed/${Date.now()+1}/400/300`, // Use uploaded or a placeholder
    apiProvider: apiProvider,
    timestamp: Date.now(),
  };
};

// Generic analyze function to simulate API call
const mockAnalyzeImage = <T,>(
  _imageFile: File | string, // File for uploads, string for live scan data URL
  apiProvider: ApiProvider,
  uploadedImageUrl?: string
): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockAnalysisResult(apiProvider, uploadedImageUrl));
    }, MOCK_API_DELAY);
  });
};


export const analyzeWithGeminiMock = (imageFile: File | string, uploadedImageUrl?: string): Promise<AnalysisResult> => {
  // Simulate Gemini specific request/response structure if needed internally
  // For now, uses the generic mock
  console.log("Mocking Gemini API call with image:", imageFile);
  return mockAnalyzeImage(imageFile, ApiProvider.GEMINI, uploadedImageUrl);
};

/*
// analyzeWithSerpAPIMock is now implemented in services/serpApiService.ts
export const analyzeWithSerpAPIMock = (imageFile: File | string, uploadedImageUrl?: string): Promise<AnalysisResult> => {
  console.log("Mocking SerpAPI call with image:", imageFile);
  return mockAnalyzeImage(imageFile, ApiProvider.SERPAPI, uploadedImageUrl);
};
*/

/*
// analyzeWithSearchAPIMock is now implemented in services/searchApiService.ts
export const analyzeWithSearchAPIMock = (imageFile: File | string, uploadedImageUrl?: string): Promise<AnalysisResult> => {
  console.log("Mocking SearchAPI call with image:", imageFile);
  return mockAnalyzeImage(imageFile, ApiProvider.SEARCHAPI, uploadedImageUrl);
};
*/
