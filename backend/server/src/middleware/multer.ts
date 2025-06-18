import multer from 'multer';
import { Request } from 'express';

// Configure Multer to store files in memory
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!')); // Pass error as first argument, second argument (false) is implicit
  }
};

// Initialize Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

// Export the middleware for single image upload
export const uploadImageMiddleware = upload.single('image'); // 'image' is the field name for the file in the form data
