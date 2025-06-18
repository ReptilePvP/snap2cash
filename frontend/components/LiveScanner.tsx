
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, Scan, StopCircle, CheckCircle } from 'phosphor-react';
import LoadingSpinner from './LoadingSpinner.tsx';
import { useToast } from '../hooks/useToast.ts';

interface LiveScannerProps {
  onScanComplete: (imageDataUrl: string) => void;
}

const LiveScanner: React.FC<LiveScannerProps> = ({ onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { addToast } = useToast();

  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          setIsCameraOn(true);
        }
      } else {
        setError('Camera access is not supported by your browser.');
        addToast('Camera access is not supported.', 'error');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('Failed to access camera. Please check permissions.');
      addToast('Failed to access camera. Check permissions.', 'error');
      setIsCameraOn(false);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, [stream]);

  useEffect(() => {
    // Cleanup: stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current && isCameraOn) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        onScanComplete(imageDataUrl);
        addToast('Image captured!', 'success');
        stopCamera(); // Optionally stop camera after capture
      } else {
        setError('Failed to capture image.');
        addToast('Failed to capture image.', 'error');
      }
    }
  }, [isCameraOn, onScanComplete, addToast, stopCamera]);

  return (
    <div className="w-full max-w-md mx-auto p-4 text-center">
      <div className="relative aspect-video bg-secondary-200 dark:bg-secondary-700 rounded-lg overflow-hidden shadow-lg mb-4">
        <video ref={videoRef} className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`} playsInline />
        {!isCameraOn && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera size={64} className="text-secondary-400 dark:text-secondary-500 mb-2" />
            <p className="text-secondary-600 dark:text-secondary-300">Camera is off</p>
          </div>
        )}
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <LoadingSpinner message="Starting camera..." />
            </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {error && <p className="text-red-500 dark:text-red-400 my-2">{error}</p>}

      <div className="space-y-2">
        {!isCameraOn ? (
          <button
            onClick={startCamera}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Camera size={20} className="mr-2" /> Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={captureImage}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center"
            >
              <Scan size={20} className="mr-2" /> Capture Image
            </button>
            <button
              onClick={stopCamera}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center"
            >
              <StopCircle size={20} className="mr-2" /> Stop Camera
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LiveScanner;