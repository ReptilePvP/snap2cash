import { AnalysisResult, ApiProvider } from '../types.ts';

// NOTE: This is a generic template for a SearchAPI provider.
// Actual endpoint, parameters, and response structure will vary depending on the specific SearchAPI service used.
// This example assumes a structure similar to SerpAPI's Google Lens for demonstration.
// You'll need to adapt this to your chosen SearchAPI provider's documentation.

interface SearchApiGoogleLensParams {
  api_key: string;
  engine: 'google_lens'; // Or similar identifier for Google Lens
  image_url: string;    // Parameter for image URL or data URL
  // Other parameters like 'country', 'language' might be 'location', 'hl', 'gl' etc.
  [key: string]: string; // Allow other string parameters
}

interface SearchApiVisualMatch {
  title: string;
  link: string;
  // Other fields like 'source', 'thumbnail'
}

interface SearchApiProductResult {
  title: string;
  link: string;
  price?: string;
  source?: string;
  // Other fields
}

interface SearchApiGoogleLensResponse {
  visual_matches?: SearchApiVisualMatch[];
  product_results?: SearchApiProductResult[];
  // It might have a different error field or structure
  error_message?: string; 
  status_code?: number;
  // Other potential fields
  search_information?: {
    query_displayed?: string;
  };
}


let searchApiKey: string | null = null;

const getSearchApiKey = (): string => {
  if (searchApiKey) return searchApiKey;
  // IMPORTANT: Replace 'SEARCHAPI_API_KEY' with the actual environment variable name for your SearchAPI provider.
  if (!process.env.SEARCHAPI_API_KEY) {
    console.error("SEARCHAPI_API_KEY environment variable is not set.");
    throw new Error("SearchAPI API key is not configured. Please set the SEARCHAPI_API_KEY environment variable.");
  }
  searchApiKey = process.env.SEARCHAPI_API_KEY;
  return searchApiKey;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const analyzeImageWithSearchAPI = async (
  imageSource: File | string,
  displayImageUrl: string
): Promise<AnalysisResult> => {
  console.log("Starting SearchAPI Google Lens call with image source type:", typeof imageSource);
  const apiKey = getSearchApiKey();

  let imageDataUrl: string;
  if (typeof imageSource === 'string') {
    imageDataUrl = imageSource;
  } else {
    imageDataUrl = await fileToDataUrl(imageSource);
  }

  // IMPORTANT: Adjust the endpoint and parameters according to your SearchAPI provider's documentation.
  const searchApiEndpoint = "https://api.example-searchapi.com/v1/search"; // Replace with actual endpoint

  const params: SearchApiGoogleLensParams = {
    api_key: apiKey,
    engine: 'google_lens', // This might be different for your provider
    image_url: imageDataUrl, // Parameter name might be 'url', 'image', 'q', etc.
    // Add other required parameters like country, language, etc.
    // e.g., location: 'United States', hl: 'en'
  };

  const queryString = new URLSearchParams(params as any).toString();
  const fullApiUrl = `${searchApiEndpoint}?${queryString}`;

  try {
    const response = await fetch(fullApiUrl); // Add headers if required by your API provider
    
    const responseData: SearchApiGoogleLensResponse = await response.json();

    if (!response.ok || responseData.error_message) {
      const errorMessage = responseData.error_message || `SearchAPI request failed: ${response.status} ${response.statusText}`;
      console.error(`SearchAPI request failed with status ${response.status}:`, responseData);
      throw new Error(errorMessage);
    }
    
    let title = "Image Analysis via SearchAPI";
    if (responseData.product_results && responseData.product_results.length > 0) {
      title = responseData.product_results[0].title;
    } else if (responseData.visual_matches && responseData.visual_matches.length > 0) {
      title = responseData.visual_matches[0].title;
    }


    let description = "Analysis based on Google Lens visual matching and product search via a SearchAPI provider.";
    // You might be able to extract more details if your SearchAPI provides them.

    let value = "See shopping results for pricing details.";
    const prices: string[] = [];
    if (responseData.product_results) {
      responseData.product_results.slice(0, 3).forEach(p => {
        if (p.price) prices.push(p.price);
      });
      if (prices.length > 0) {
        value = `Similar items listed at: ${prices.join(', ')}.`;
      }
    }

    let aiExplanation = `Analysis performed using Google Lens via a SearchAPI provider. Results are based on visual similarity and product search.\n\n`;

    if (responseData.visual_matches && responseData.visual_matches.length > 0) {
      aiExplanation += "**Top Visual Matches:**\n";
      responseData.visual_matches.slice(0, 3).forEach(match => {
        aiExplanation += `- [${match.title}](${match.link})\n`; // Adapt if source/icon available
      });
      aiExplanation += "\n";
    }

    if (responseData.product_results && responseData.product_results.length > 0) {
      aiExplanation += "**Product Listings Found:**\n";
      responseData.product_results.slice(0, 3).forEach(product => {
        aiExplanation += `- [${product.title}](${product.link}) ${product.price ? `- **Price: ${product.price}**` : ''} ${product.source ? `(Source: ${product.source})` : ''}\n`;
      });
      aiExplanation += "\n";
    }
    
    aiExplanation += "*Note: Prices and availability are subject to change. This analysis provides visual matches and shopping information.*";
    aiExplanation += "\n\n**Important:** This SearchAPI integration is a template. You MUST adapt the endpoint, parameters, and response parsing to your specific SearchAPI provider.";


    return {
      id: `searchapi-${Date.now()}`,
      title: title,
      description: description,
      value: value,
      aiExplanation: aiExplanation,
      imageUrl: displayImageUrl,
      apiProvider: ApiProvider.SEARCHAPI,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error('Error during SearchAPI call or processing:', error);
    if (error instanceof Error) {
      throw new Error(`SearchAPI Service Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while analyzing with SearchAPI.');
  }
};