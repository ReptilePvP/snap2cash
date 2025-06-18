import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { AnalysisResult, ApiProvider } from '../types.ts';

// Helper to convert File to a Gemini Part
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

// Helper to convert base64 data URL to a Gemini Part
async function dataUrlToGenerativePart(dataUrl: string): Promise<Part> {
    const mimeTypeMatch = dataUrl.match(/^data:(.+);base64,/);
    if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
        throw new Error("Invalid data URL format. Could not extract MIME type.");
    }
    const mimeType = mimeTypeMatch[1];
    const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
    
    if (!mimeType || !base64Data) {
        throw new Error("Invalid data URL format. MIME type or data is missing.");
    }

    return {
        inlineData: {
            mimeType: mimeType,
            data: base64Data
        }
    };
}

// Roo: New helper to fetch a URL, convert to base64, and return a Gemini Part
async function urlToGenerativePart(url: string): Promise<Part> {
  const proxyUrl = `/gcs/${url.substring('https://storage.googleapis.com/'.length)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from GCS via proxy: ${response.statusText}`);
  }
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
      resolve({
        inlineData: {
          mimeType: blob.type,
          data: base64Data,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

interface GeminiResponseJson {
  itemName: string;
  itemDescription: string; // Markdown
  estimatedValue: string; // e.g., "$25–$45"
  valuationRationale: string; // Markdown
}

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable is not set.");
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export const analyzeImageWithGemini = async (
  imageSource: File | string, // File object or base64 data URL string
  displayImageUrl: string   // URL (blob or data) for displaying in ResultCard
): Promise<AnalysisResult> => {
  console.log("Starting Gemini API call with image source type:", typeof imageSource);
  console.log("Received imageSource:", imageSource); // Roo: Add this log to see what's being passed.

  const client = getAiClient();

  try {
    const imagePart: Part = typeof imageSource === 'string'
      ? (imageSource.startsWith('data:')
          ? await dataUrlToGenerativePart(imageSource)
          : await urlToGenerativePart(imageSource)) // Roo: Use the new URL fetcher
      : await fileToGenerativePart(imageSource);

    const textPart: Part = {
      text: `Analyze the item in the provided image.
      Your goal is to provide information for a resale value estimation app.
      Please respond strictly with a JSON object. Do not include any text outside of this JSON object, and do not use markdown fences (like \`\`\`json) around the JSON.
      The JSON object must have the following keys:
      1.  "itemName": A concise and descriptive name for the item (string).
      2.  "itemDescription": A detailed description of the item, suitable for display to a user. Include characteristics like type, material, potential brand, condition (as observable from the image), and any notable features. This should be formatted as a Markdown string.
      3.  "estimatedValue": An estimated resale value range for the item (e.g., "$50 - $75", "Around $100"). Base this on the item's visual characteristics and common knowledge of similar items. (string).
      4.  "valuationRationale": An explanation of how the estimatedValue was derived. Mention factors considered, such as perceived condition, rarity, brand (if identifiable), and general market perception for such items. This should be formatted as a Markdown string.

      Example for "itemDescription": "A vintage-style ceramic teapot with a floral pattern. Appears to be in good condition with no visible chips or cracks. The lid is present. Unknown brand."
      Example for "valuationRationale": "The teapot's vintage aesthetic and good apparent condition suggest a moderate resale value. Floral ceramic teapots are popular among collectors. Without brand identification or a view of maker's marks, the estimate is based on general market prices for similar unbranded items."
      Focus on visual analysis. Do not ask for more images or information. Provide the best possible analysis based on the single image provided.
      `
    };

    const response: GenerateContentResponse = await client.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: [{ parts: [imagePart, textPart] }], // Corrected: contents is Content[]
        config: {
            responseMimeType: "application/json",
            temperature: 0.5, // Adjust for more deterministic/creative output
        }
    });

    const responseText = response.text;
    if (typeof responseText !== 'string') {
        console.error("Gemini response did not contain text:", response);
        throw new Error("Received an invalid or empty response from Gemini.");
    }
    console.log("Gemini raw response text:", responseText);

    let jsonStr = responseText.trim();
    // Although responseMimeType: "application/json" is used, models can sometimes still wrap output.
    // The prompt explicitly asks not to use markdown fences, but this is a safeguard.
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) { // match[1] is the content within fences
      jsonStr = match[1].trim();
    }
    
    let parsedData: GeminiResponseJson;
    try {
        parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse JSON response from Gemini:", parseError);
        console.error("Problematic JSON string received:", jsonStr); // Log the string that failed to parse
        throw new Error(`Failed to parse analysis data from Gemini. Check console for the raw response. Ensure the model returns valid JSON.`);
    }

    if (!parsedData.itemName || !parsedData.itemDescription || !parsedData.estimatedValue || !parsedData.valuationRationale) {
        console.error("Gemini response is missing one or more required fields:", parsedData);
        throw new Error("Incomplete analysis data received from Gemini. Required fields: itemName, itemDescription, estimatedValue, valuationRationale.");
    }
    
    return {
      id: `gemini-${Date.now()}`,
      title: parsedData.itemName,
      description: parsedData.itemDescription,
      value: parsedData.estimatedValue,
      aiExplanation: parsedData.valuationRationale,
      imageUrl: displayImageUrl,
      apiProvider: ApiProvider.GEMINI,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error('Error during Gemini API call or processing:', error);
    if (error instanceof Error) {
        // More specific error handling can be added here based on error types from Gemini SDK if available
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while analyzing with Gemini.');
  }
};
