import { Router, Request, Response } from 'express';
import { uploadImageMiddleware } from '../middleware/multer';
import { uploadFileToGCS } from '../utils/gcsUploader';
import asyncHandler from '../utils/asyncHandler'; // Import the asyncHandler

const router = Router();

router.post(
  '/',
  uploadImageMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    const imageUrl = await uploadFileToGCS(req.file);

    res.status(200).json({ success: true, imageUrl });
    return; // Explicitly return void to satisfy TypeScript
  })
);

export default router;
