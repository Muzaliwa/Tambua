import React, { useEffect, useState } from 'react';

// Déclare la bibliothèque QRCode sur l'objet window pour TypeScript
declare global {
  interface Window {
    QRCode: any;
  }
}

interface QRCodeGeneratorProps {
  text: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ text, size = 48 }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (text && typeof window.QRCode !== 'undefined') {
      // Options pour améliorer la qualité visuelle
      const options = {
        errorCorrectionLevel: 'H' as 'H',
        width: size * 4, // Générer à une résolution plus élevée
        margin: 1,
      };
      
      window.QRCode.toDataURL(text, options, (err: Error | null, url: string) => {
        if (err) {
          console.error("Erreur de génération du QR Code:", err);
          return;
        }
        setQrCodeUrl(url);
      });
    }
  }, [text, size]);

  if (!qrCodeUrl) {
    return <div style={{ width: size, height: size }} className="bg-gray-200 animate-pulse rounded-sm"></div>;
  }

  return <img src={qrCodeUrl} alt="QR Code" style={{ width: size, height: size, imageRendering: 'pixelated' }} />;
};

export default QRCodeGenerator;