import { AnalysisResult, ApiProvider } from '../types.ts';

// Keep the interfaces for type safety when processing the data
interface SerpAPIVisualMatch {
  position: number;
  title: string;
  link: string;
  thumbnail?: string;
  source_icon?: string;
}

interface SerpAPIProductResult {
  position: number;
  title: string;
  link: string;
  price?: string;
  source?: string;
  thumbnail?: string;
  rating?: number;
  reviews?: number;
  extensions?: string[];
}

interface SerpAPIGoogleLensResponse {
  visual_matches?: SerpAPIVisualMatch[];
  product_results?: SerpAPIProductResult[];
  text_results?: Array<{ text: string; link?: string }>;
  error?: string;
}

export const analyzeImageWithSerpAPI = async (
  publicImageUrl: string,
  displayImageUrl: string
): Promise<AnalysisResult> => {
  console.log("Requesting SerpAPI analysis from backend for URL:", publicImageUrl);

  try {
    // The request is now sent to our own backend proxy
    const response = await fetch('http://localhost:8080/api/analyze-serpapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: publicImageUrl }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Backend proxy returned an error:", result.message);
      throw new Error(result.message || `Backend request failed: ${response.statusText}`);
    }

    // The actual SerpAPI data is now nested under the 'data' property
    const data: SerpAPIGoogleLensResponse = result.data;

    if (data.error) {
      console.error("SerpAPI returned an error via proxy:", data.error);
      throw new Error(`SerpAPI Error: ${data.error}`);
    }

    let title = "Image Analysis via SerpAPI";
    if (data.product_results && data.product_results.length > 0) {
      title = data.product_results[0].title;
    } else if (data.visual_matches && data.visual_matches.length > 0) {
      title = data.visual_matches[0].title;
    }

    let description = "Analysis based on Google Lens visual matching and product search via SerpAPI.";
    if (data.text_results && data.text_results.length > 0) {
        description += ` Detected text: "${data.text_results.map(tr => tr.text).join(', ')}"`;
    }

    let value = "See shopping results for pricing details.";
    const prices: string[] = [];
    if (data.product_results) {
      data.product_results.slice(0, 3).forEach(p => {
        if (p.price) prices.push(p.price);
      });
      if (prices.length > 0) {
        value = `Similar items listed at: ${prices.join(', ')}.`;
      }
    }

    let aiExplanation = `Analysis performed using Google Lens via SerpAPI. Results are based on visual similarity and product search.\n\n`;

    const visualMatches = data.visual_matches ? data.visual_matches.slice(0, 5).map(match => ({
      title: match.title,
      link: match.link,
      source_icon: match.source_icon,
      thumbnail: match.thumbnail,
    })) : [];

    if (data.product_results && data.product_results.length > 0) {
      aiExplanation += "**Product Listings Found:**\n";
      data.product_results.slice(0, 3).forEach(product => {
        aiExplanation += `- [${product.title}](${product.link}) ${product.price ? `- **Price: ${product.price}**` : ''} ${product.source ? `(Source: ${product.source})` : ''}\n`;
      });
      aiExplanation += "\n";
    }
    
    aiExplanation += "*Note: Prices and availability are subject to change. This analysis provides visual matches and shopping information.*";

    return {
      id: `serpapi-${Date.now()}`,
      title: title,
      description: description,
      value: value,
      aiExplanation: aiExplanation,
      visualMatches: visualMatches,
      imageUrl: displayImageUrl,
      apiProvider: ApiProvider.SERPAPI,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error('Error during SerpAPI analysis via backend:', error);
    if (error instanceof Error) {
      throw new Error(`SerpAPI Service Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while analyzing with SerpAPI.');
  }
};
