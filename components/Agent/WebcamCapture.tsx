import React, { useRef, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setError("Impossible d'accéder à la webcam. Veuillez vérifier les permissions dans votre navigateur.");
      }
    };

    getMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        onCapture(imageDataUrl);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 max-w-lg w-full">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Prendre une photo</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
        
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleCapture}
            disabled={!!error}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center disabled:bg-blue-300"
          >
            <Camera className="w-4 h-4 mr-2" />
            Capturer
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
