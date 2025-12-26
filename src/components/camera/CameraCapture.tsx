/**
 * Camera Capture Component
 * Provides camera access for QR code scanning and photo capture
 */

'use client';

import React, { useRef, useState, useCallback } from 'react';

export interface CameraCaptureProps {
  onCapture?: (imageData: string) => void;
  onScan?: (qrCode: string) => void;
  mode?: 'photo' | 'scan' | 'both';
  className?: string;
}

export function CameraCapture({
  onCapture,
  onScan,
  mode = 'both',
  className = '',
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
        setError(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      console.error('Camera access error:', err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsActive(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);

    if (onCapture) {
      onCapture(imageData);
    }

    // Stop camera after capture
    stopCamera();
  }, [onCapture, stopCamera]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        if (onCapture) {
          onCapture(imageData);
        }
      };
      reader.readAsDataURL(file);
    },
    [onCapture]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Camera Preview */}
      {isActive && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto max-h-96 object-contain"
          />
          {mode === 'scan' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white border-dashed w-64 h-64 rounded-lg" />
            </div>
          )}
        </div>
      )}

      {/* Captured Image Preview */}
      {capturedImage && !isActive && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-auto max-h-96 object-contain"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {!isActive && !capturedImage && (
          <>
            {(mode === 'photo' || mode === 'both') && (
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
              >
                Open Camera
              </button>
            )}
            <label className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer touch-manipulation">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        )}

        {isActive && (
          <>
            {(mode === 'photo' || mode === 'both') && (
              <button
                onClick={capturePhoto}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 touch-manipulation"
              >
                Capture
              </button>
            )}
            <button
              onClick={stopCamera}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 touch-manipulation"
            >
              Cancel
            </button>
          </>
        )}

        {capturedImage && (
          <button
            onClick={() => {
              setCapturedImage(null);
              if (onCapture) {
                onCapture('');
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 touch-manipulation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

