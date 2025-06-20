import Constants from 'expo-constants';

const API_BASE_URL = __DEV__
  ? 'http://localhost:8080'
  : Constants.expoConfig?.extra?.apiUrl || 'https://your-backend-url.com';

export const uploadImageToBackend = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  
  // Create a file object from the image URI
  const response = await fetch(imageUri);
  const blob = await response.blob();
  
  formData.append('image', blob as any, 'image.jpg');

  try {
    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await uploadResponse.json();

    if (uploadResponse.ok && data.success) {
      return data.imageUrl;
    } else {
      throw new Error(data.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Network error or server is unreachable');
  }
};

export const analyzeImageWithSerpAPI = async (imageUrl: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze-serpapi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
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