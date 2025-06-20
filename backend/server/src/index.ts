import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadImageRouter from './routes/uploadImage';
import analyzeSerpApiRouter from './routes/analyzeSerpApi';
import authRouter from './routes/auth';
import analyzeSearchApiRouter from './routes/analyzeSearchApi';
import generateUploadUrlRouter from './routes/generateUploadUrl';

// Load environment variables from .env file
dotenv.config();

import analyzeGeminiRouter from './routes/analyzeGemini';
const app = express();
const PORT = process.env.PORT || 8080; // Default to 8080 for Cloud Run compatibility

// Enable CORS for the frontend origin during development.
// In production, replace 'http://localhost:5173' with your actual frontend domain.
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both web and mobile dev servers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the authentication router
app.use('/api/auth', authRouter);

// Mount the image upload router
app.use('/api/upload-image', uploadImageRouter);

// Mount the SerpAPI analysis router
app.use('/api/analyze-serpapi', analyzeSerpApiRouter);

// Mount the SearchAPI analysis router
app.use('/api/analyze-searchapi', analyzeSearchApiRouter);

// Mount the generate upload URL router
app.use('/api/generate-upload-url', generateUploadUrlRouter);

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Global error handling middleware
app.use('/api/analyze-gemini', analyzeGeminiRouter);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack, // Don't expose stack in production
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`GCS Bucket Name: ${process.env.GCS_BUCKET_NAME}`);
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('WARNING: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set. GCS authentication might fail if not running in a Google Cloud environment with default credentials.');
  }
});
