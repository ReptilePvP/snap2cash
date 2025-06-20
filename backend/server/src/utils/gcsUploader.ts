import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Initialize Google Cloud Storage client
// For local development, GOOGLE_APPLICATION_CREDENTIALS environment variable
// should point to your service-account.json file.
// In Google Cloud Run, it will automatically use the service account attached to the service.
const storage = new Storage();

const bucketName = process.env.GCS_BUCKET_NAME || 'snap2cash-uploads';
const bucket = storage.bucket(bucketName);

/**
 * Uploads a file buffer to Google Cloud Storage and returns its public URL.
 * @param file The file object from Multer.
 * @returns A promise that resolves with the public URL of the uploaded file.
 */
export const uploadFileToGCS = async (file: Express.Multer.File): Promise<string> => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set.');
  }

  const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const blob = bucket.file(uniqueFileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error('GCS upload error:', err);
      reject(new Error(`Unable to upload image to GCS: ${err.message}`));
    });

    blobStream.on('finish', async () => {
      // Make the file publicly readable
      await blob.makePublic();

      // Construct the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

/**
 * Generates a v4 signed URL for uploading a file to Google Cloud Storage.
 * @param fileName The name of the file to be uploaded.
 * @param contentType The MIME type of the file.
 * @returns A promise that resolves with the signed URL and the public URL.
 */
export const generateV4UploadSignedUrl = async (
  fileName: string,
  contentType: string
): Promise<{ signedUrl: string; publicUrl: string }> => {
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set.');
  }

  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  };

  const [signedUrl] = await bucket.file(fileName).getSignedUrl(options);
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

  return { signedUrl, publicUrl };
};
