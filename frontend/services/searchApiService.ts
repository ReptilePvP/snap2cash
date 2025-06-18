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
  thumbnail?: string;
  source_icon?: string;
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

  let imageDataUrl: string;
  if (typeof imageSource === 'string') {
    imageDataUrl = imageSource;
  } else {
    imageDataUrl = await fileToDataUrl(imageSource);
  }

  const backendApiUrl = '/api/analyze-searchapi';

  try {
    const response = await fetch(backendApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: imageDataUrl }),
    });
    
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      const errorMessage = responseData.message || `SearchAPI request failed: ${response.status} ${response.statusText}`;
      console.error(`SearchAPI request failed with status ${response.status}:`, responseData);
      throw new Error(errorMessage);
    }
    
    const searchApiData: SearchApiGoogleLensResponse = responseData.data;
    
    let title = "Image Analysis via SearchAPI";
    if (searchApiData.product_results && searchApiData.product_results.length > 0) {
      title = searchApiData.product_results[0].title;
    } else if (searchApiData.visual_matches && searchApiData.visual_matches.length > 0) {
      title = searchApiData.visual_matches[0].title;
    }


    let description = "Analysis based on Google Lens visual matching and product search via a SearchAPI provider.";
    // You might be able to extract more details if your SearchAPI provides them.

    let value = "See shopping results for pricing details.";
    const prices: string[] = [];
    if (searchApiData.product_results) {
      searchApiData.product_results.slice(0, 3).forEach(p => {
        if (p.price) prices.push(p.price);
      });
      if (prices.length > 0) {
        value = `Similar items listed at: ${prices.join(', ')}.`;
      }
    }

    let aiExplanation = `Analysis performed using Google Lens via a SearchAPI provider. Results are based on visual similarity and product search.\n\n`;

    const visualMatches = searchApiData.visual_matches ? searchApiData.visual_matches.slice(0, 5).map(match => ({
      title: match.title,
      link: match.link,
      source_icon: match.source_icon,
      thumbnail: match.thumbnail,
    })) : [];

    if (searchApiData.product_results && searchApiData.product_results.length > 0) {
      aiExplanation += "**Product Listings Found:**\n";
      searchApiData.product_results.slice(0, 3).forEach(product => {
        aiExplanation += `- [${product.title}](${product.link}) ${product.price ? `- **Price: ${product.price}**` : ''} ${product.source ? `(Source: ${product.source})` : ''}\n`;
      });
      aiExplanation += "\n";
    }
    
    aiExplanation += "*Note: Prices and availability are subject to change. This analysis provides visual matches and shopping information.*";


    return {
      id: `searchapi-${Date.now()}`,
      title: title,
      description: description,
      value: value,
      aiExplanation: aiExplanation,
      visualMatches: visualMatches,
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