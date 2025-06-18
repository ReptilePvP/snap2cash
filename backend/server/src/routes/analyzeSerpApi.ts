import { Router, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { getJson } from 'serpapi';

const router = Router();

// This route proxies the request to the SerpAPI service using the official library
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ success: false, message: 'No image URL provided.' });
      return;
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: SERPAPI_API_KEY is not set on the server.');
      res.status(500).json({ success: false, message: 'Server configuration error: SerpAPI key not found.' });
      return;
    }

    const params = {
      engine: 'google_lens',
      url: imageUrl,
      hl: 'en',
      gl: 'us',
      api_key: apiKey,
    };

    try {
      console.log(`Sending request to SerpAPI with URL: ${imageUrl}`);
      const data = await getJson(params);
      console.log('Successfully received data from SerpAPI.');
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error from SerpAPI library:', error);
      // The library might throw an error with a message
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred with SerpAPI.';
      res.status(500).json({ success: false, message: errorMessage });
    }
  })
);

export default router;