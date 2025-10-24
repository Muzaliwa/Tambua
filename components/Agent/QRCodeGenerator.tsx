import React, { useEffect, useState } from 'react';

// Déclare la bibliothèque QRCode sur l'objet window pour TypeScript
declare global {
  interface Window {
    QRCode: any;
  }
}

interface QRCodeGeneratorProps {
  data: object;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, size = 48 }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (data && typeof window.QRCode !== 'undefined') {
      const jsonString = JSON.stringify(data, null, 2);
      window.QRCode.toDataURL(jsonString, { errorCorrectionLevel: 'H' }, (err: Error | null, url: string) => {
        if (err) {
          console.error("Erreur de génération du QR Code:", err);
          return;
        }
        setQrCodeUrl(url);
      });
    }
  }, [data]);

  if (!qrCodeUrl) {
    return <div style={{ width: size, height: size }} className="bg-gray-200 animate-pulse rounded-sm"></div>;
  }

  return <img src={qrCodeUrl} alt="QR Code" style={{ width: size, height: size }} />;
};

export default QRCodeGenerator;
