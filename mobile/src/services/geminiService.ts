import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { AnalysisResult, ApiProvider } from '../types';
import Constants from 'expo-constants';

// Get API key from environment
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

interface GeminiResponseJson {
  itemName: string;
  itemDescription: string;
  estimatedValue: string;
  valuationRationale: string;
}

// Helper to convert image URI to base64
async function imageUriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper to convert base64 data URL to a Gemini Part
async function dataUrlToGenerativePart(dataUrl: string): Promise<Part> {
  const mimeTypeMatch = dataUrl.match(/^data:(.+);base64,/);
  if (!mimeTypeMatch || mimeTypeMatch.length < 2) {
    throw new Error("Invalid data URL format. Could not extract MIME type.");
  }
  const mimeType = mimeTypeMatch[1];
  const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
  
  return {
    inlineData: {
      mimeType: mimeType,
      data: base64Data
    }
  };
}

let ai: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment.");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
};

export const analyzeImageWithGemini = async (
  imageSource: string, // Image URI or data URL
  displayImageUrl: string
): Promise<AnalysisResult> => {
  console.log("Starting Gemini API call with image source:", imageSource);

  const client = getAiClient();

  try {
    let imagePart: Part;
    
    if (imageSource.startsWith('data:')) {
      // Handle data URL
      imagePart = await dataUrlToGenerativePart(imageSource);
    } else {
      // Handle image URI - convert to base64
      const base64Data = await imageUriToBase64(imageSource);
      imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      };
    }

    const textPart: Part = {
      text: `Analyze the item in the provided image.
      Your goal is to provide information for a resale value estimation app.
      Please respond strictly with a JSON object. Do not include any text outside of this JSON object, and do not use markdown fences (like \`\`\`json) around the JSON.
      The JSON object must have the following keys:
      1.  "itemName": A concise and descriptive name for the item (string).
      2.  "itemDescription": A detailed description of the item, suitable for display to a user. Include characteristics like type, material, potential brand, condition (as observable from the image), and any notable features. This should be formatted as a Markdown string.
      3.  "estimatedValue": An estimated resale value range for the item (e.g., "$50 - $75", "Around $100"). Base this on the item's visual characteristics and common knowledge of similar items. (string).
      4.  "valuationRationale": An explanation of how the estimatedValue was derived. Mention factors considered, such as perceived condition, rarity, brand (if identifiable), and general market perception for such items. This should be formatted as a Markdown string.

      Focus on visual analysis. Do not ask for more images or information. Provide the best possible analysis based on the single image provided.`
    };

    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: [{ parts: [imagePart, textPart] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });

    const responseText = response.text;
    if (typeof responseText !== 'string') {
      throw new Error("Received an invalid or empty response from Gemini.");
    }

    let jsonStr = responseText.trim();
    // Remove potential markdown fences
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    let parsedData: GeminiResponseJson;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError);
      throw new Error("Failed to parse analysis data from Gemini.");
    }

    if (!parsedData.itemName || !parsedData.itemDescription || !parsedData.estimatedValue || !parsedData.valuationRationale) {
      throw new Error("Incomplete analysis data received from Gemini.");
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
    console.error('Error during Gemini API call:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('An unknown error occurred while analyzing with Gemini.');
  }
};