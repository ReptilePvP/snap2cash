import { Router, Request, Response } from 'express';
import { generateV4UploadSignedUrl } from '../utils/gcsUploader';
import asyncHandler from '../utils/asyncHandler';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { contentType, fileExtension } = req.body;

    if (!contentType || !fileExtension) {
      return res.status(400).json({
        success: false,
        message: 'Content type and file extension are required.',
      });
    }

    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    try {
      const { signedUrl, publicUrl } = await generateV4UploadSignedUrl(
        uniqueFileName,
        contentType
      );
      res.status(200).json({ success: true, signedUrl, publicUrl });
    } catch (error) {
      console.error('Failed to generate signed URL:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to generate upload URL.' });
    }
  })
);

export default router;