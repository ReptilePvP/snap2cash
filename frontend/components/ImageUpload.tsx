
import React, { useState, useCallback, useRef } from 'react';
import { UploadSimple, FileImage, XCircle } from 'phosphor-react';
import { motion } from 'framer-motion';

interface ImageUploadProps {
  onBackendImageUploadSuccess: (imageUrl: string) => void;
  isAnalyzing: boolean;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onBackendImageUploadSuccess, 
  isAnalyzing,
  onUploadStart,
  onUploadEnd
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImageToBackend = useCallback(async (file: File) => {
    setIsUploading(true);
    onUploadStart?.();
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:8080/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onBackendImageUploadSuccess(data.imageUrl);
      } else {
        setError(data.message || 'Failed to upload image.');
        setPreview(null);
      }
    } catch (err: any) {
      console.error('Network or upload error:', err);
      setError('Network error or server is unreachable. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  }, [onBackendImageUploadSuccess, onUploadStart, onUploadEnd]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Maximum size is 5MB.');
        setPreview(null);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        setError('Invalid file type. Please upload an image (JPEG, PNG, WEBP, GIF).');
        setPreview(null);
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        uploadImageToBackend(file); 
      };
      reader.readAsDataURL(file);
    }
  }, [uploadImageToBackend]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isAnalyzing || isUploading) return;
    
    const file = event.dataTransfer.files?.[0];
    if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        if (file) dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
    }
  }, [isAnalyzing, isUploading]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    // Optionally call a prop to notify parent that image is cleared
  };

  const isDisabled = isAnalyzing || isUploading;

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDisabled ? 'border-secondary-300 dark:border-secondary-600 bg-secondary-100 dark:bg-secondary-800 cursor-not-allowed' 
                                   : 'border-primary-400 dark:border-primary-600 hover:border-primary-500 dark:hover:border-primary-500 bg-secondary-50 dark:bg-secondary-800/50'}`}
        onClick={() => !isDisabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={isDisabled}
        />
        {preview ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-md shadow-md" />
            {!isDisabled && (
              <button 
                onClick={(e) => { e.stopPropagation(); clearPreview(); }} 
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <XCircle size={20} />
              </button>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <UploadSimple size={48} className={`transition-colors ${isDisabled ? 'text-secondary-400 dark:text-secondary-500' : 'text-primary-500 dark:text-primary-400'}`} />
            <p className={`transition-colors text-lg font-semibold ${isDisabled ? 'text-secondary-500 dark:text-secondary-400' : 'text-secondary-700 dark:text-secondary-300'}`}>
              {isDisabled ? (isAnalyzing ? 'Analyzing...' : 'Uploading...') : 'Drag & drop or click to upload'}
            </p>
            <p className={`transition-colors text-sm ${isDisabled ? 'text-secondary-400 dark:text-secondary-500' : 'text-secondary-500 dark:text-secondary-400'}`}>
              PNG, JPG, GIF, WEBP up to 5MB
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
      {!preview && !isDisabled && (
         <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className="mt-4 w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            <FileImage size={20} className="mr-2" /> Select Image
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
