"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  error: string | null;
}

export function CameraCapture({ onCapture, error }: CameraCaptureProps) {
  const [mode, setMode] = useState<"choose" | "camera" | "preview">("choose");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      });
      streamRef.current = stream;
      setMode("camera");
    } catch {
      setCameraError(
        "Camera access denied. Please allow camera access or upload a photo instead."
      );
    }
  }, []);

  // Attach stream to video element after it mounts
  useEffect(() => {
    if (mode === "camera" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        // autoplay may be blocked, but autoPlay attr should handle it
      });
    }
  }, [mode]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror the image (since video is mirrored)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/jpeg", 0.85);
    setPreviewImage(imageData);
    setMode("preview");
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setCameraError("Please select an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setMode("preview");
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (previewImage) {
      onCapture(previewImage);
    }
  }, [previewImage, onCapture]);

  const handleRetake = useCallback(() => {
    setPreviewImage(null);
    setMode("choose");
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl md:text-4xl mb-3"
          style={{ fontWeight: 300 }}
        >
          Find Your Shade
        </h1>
        <p className="text-base text-[var(--jrb-muted)]" style={{ fontWeight: 400 }}>
          Take a selfie or upload a photo. Our AI will match you to your
          perfect Jones Road shades.
        </p>
      </div>

      {/* Error messages */}
      {(error || cameraError) && (
        <div className="w-full mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
          {error || cameraError}
        </div>
      )}

      {/* Choose mode */}
      {mode === "choose" && (
        <div className="w-full space-y-4">
          {/* Tips */}
          <div className="p-4 rounded bg-[#f5f0ea] mb-6">
            <p
              className="text-xs text-[var(--jrb-muted)] mb-2 uppercase tracking-wider"
              style={{ fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
            >
              For best results
            </p>
            <ul className="text-sm text-[var(--jrb-brown)] space-y-1" style={{ fontFamily: "system-ui, sans-serif", fontWeight: 400 }}>
              <li>Use natural daylight, facing a window</li>
              <li>Remove makeup if possible</li>
              <li>Show your full face and neck</li>
              <li>Avoid heavy filters</li>
            </ul>
          </div>

          <button
            onClick={startCamera}
            className="jrb-button jrb-button-primary w-full"
          >
            Take a Selfie
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="jrb-button jrb-button-secondary w-full"
          >
            Upload a Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera mode */}
      {mode === "camera" && (
        <div className="w-full">
          <div className="camera-viewfinder aspect-[3/4] bg-black rounded-lg mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                stopCamera();
                setMode("choose");
              }}
              className="jrb-button jrb-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={capturePhoto}
              className="jrb-button jrb-button-primary flex-1"
            >
              Capture
            </button>
          </div>
        </div>
      )}

      {/* Preview mode */}
      {mode === "preview" && previewImage && (
        <div className="w-full">
          <div className="aspect-[3/4] bg-black rounded-lg mb-4 overflow-hidden">
            <img
              src={previewImage}
              alt="Your selfie"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="jrb-button jrb-button-secondary flex-1"
            >
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className="jrb-button jrb-button-primary flex-1"
            >
              Find My Shades
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
