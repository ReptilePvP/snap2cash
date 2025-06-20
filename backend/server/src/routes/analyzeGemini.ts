import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { GoogleGenAI, Part } from '@google/genai';

const router = Router();

router.post('/', asyncHandler(async (req, res) => {
  const { imageUrl, apiKey } = req.body;

  if (!imageUrl || !apiKey) {
    return res.status(400).json({ success: false, message: 'Image URL and API key are required.' });
  }

  const ai = new GoogleGenAI({ apiKey });

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

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
  }
  const blob = await response.blob();
  const reader = new FileReader();
  const imagePart: Part = await new Promise((resolve, reject) => {
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

  const result = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [imagePart, textPart] }],
      config: {
          responseMimeType: "application/json",
          temperature: 0.5,
      }
  });

  const responseText = result.text;
  if (typeof responseText !== 'string') {
      throw new Error("Received an invalid or empty response from Gemini.");
  }

  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }
  
  const parsedData = JSON.parse(jsonStr);

  res.json({ success: true, data: parsedData });
}));

export default router;