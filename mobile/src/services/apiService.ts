import Constants from 'expo-constants';

const API_BASE_URL = __DEV__
  ? 'http://192.168.1.98:8080' // Updated with your computer's local IP address
  : Constants.expoConfig?.extra?.apiUrl || 'https://your-backend-url.com';

const getFileExtension = (uri: string): string => {
  const match = /\.([0-9a-z]+)(?:[\?#]|$)/i.exec(uri);
  return match ? match[1] : 'jpg'; // Default to jpg if no extension found
};

export const uploadImageDirectly = async (
  imageUri: string
): Promise<string> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const contentType = blob.type;
  const fileExtension = getFileExtension(imageUri);

  // 1. Get signed URL from your backend
  const urlResponse = await fetch(`${API_BASE_URL}/api/generate-upload-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentType, fileExtension }),
  });

  const urlData = await urlResponse.json();

  if (!urlResponse.ok || !urlData.success) {
    throw new Error(urlData.message || 'Failed to get signed URL');
  }

  const { signedUrl, publicUrl } = urlData;

  // 2. Upload image directly to GCS using the signed URL
  const gcsResponse = await fetch(signedUrl, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': contentType,
    },
  });

  if (!gcsResponse.ok) {
    const errorText = await gcsResponse.text();
    console.error('GCS Upload Error:', errorText);
    throw new Error('Failed to upload image to Google Cloud Storage.');
  }

  // 3. Return the public URL of the uploaded image
  return publicUrl;
};

export const analyzeImageWithSerpAPI = async (imageUrl: string): Promise<any> => {
  const SERP_API_KEY = Constants.expoConfig?.extra?.serpApiKey;
  if (!SERP_API_KEY) {
    throw new Error("SerpAPI key is not configured in app.json extra.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-serpapi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, apiKey: SERP_API_KEY }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Analysis failed');
    }

    return result.data;
  } catch (error) {
    console.error('SerpAPI analysis error:', error);
    throw error;
  }
};

export const analyzeImageWithSearchAPI = async (imageUrl: string): Promise<any> => {
  const SEARCH_API_KEY = Constants.expoConfig?.extra?.searchApiKey;
  if (!SEARCH_API_KEY) {
    throw new Error("SearchAPI key is not configured in app.json extra.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-searchapi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, apiKey: SEARCH_API_KEY }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'SearchAPI analysis failed');
    }

    return result.data;
  } catch (error) {
    console.error('SearchAPI analysis error:', error);
    throw error;
  }
};

export const analyzeImageWithGeminiAPI = async (imageUrl: string): Promise<any> => {
  const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey;
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured in app.json extra.");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, apiKey: GEMINI_API_KEY }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Gemini analysis failed');
    }

    return result.data;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
};
