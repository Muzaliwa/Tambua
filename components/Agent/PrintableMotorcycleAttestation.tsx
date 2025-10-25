import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';

interface PrintableMotorcycleAttestationProps {
  data: {
    plate: string;
    owner: string;
    address: string;
    makeModel: string;
    year: string;
    chassis: string;
    color: string;
    qrCode: string;
    zone: string;
  };
}

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[5.5px] uppercase text-gray-600 tracking-wide">{label}</p>
        <p className="text-[7px] font-bold uppercase font-mono text-black">{value}</p>
    </div>
);

const PrintableMotorcycleAttestation: React.FC<PrintableMotorcycleAttestationProps> = ({ data }) => {
  const qrCodeText = [
    `TYPE: ATTESTATION DE PROPRIETE MOTO`,
    `STATUT: Valide`,
    `PLAQUE: ${data.plate}`,
    `PROPRIETAIRE: ${data.owner}`,
    `ADRESSE: ${data.address}`,
    `MARQUE/MODELE: ${data.makeModel}`,
    `CHASSIS: ${data.chassis}`,
    `ANNEE: ${data.year}`,
    `QR_NUMERO: ${data.qrCode}`,
    `ZONE: ${data.zone}`
  ].join('\n');
  
  return (
    <div className="printable-area print-card-format">
      <div className="w-[85.6mm] h-[53.98mm] bg-green-50 border border-green-200 rounded-lg shadow-md p-[5px] flex flex-col font-sans relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
            <p className="text-[56px] font-black text-green-500 opacity-10 rotate-[-20deg]">MOTO</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dotted border-green-300 pb-0.5 z-10">
          <div className="text-left">
            <p className="text-[7px] font-bold text-black">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
            <p className="text-[6px] text-black font-semibold">ATTESTATION DE PROPRIÉTÉ - MOTO</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 flex pt-1 z-10">
          <div className="w-full space-y-0.5">
            <Field label="N° PLAQUE" value={data.plate} />
            <Field label="PROPRIÉTAIRE" value={data.owner} />
            <Field label="MARQUE / MODÈLE" value={data.makeModel} />
            <Field label="N° CHÂSSIS" value={data.chassis} />
             <div className="grid grid-cols-4 gap-x-1">
                <Field label="ANNÉE" value={data.year} />
                <Field label="COULEUR" value={data.color} />
                <Field label="QR CODE" value={data.qrCode} />
                <Field label="ZONE" value={data.zone} />
            </div>
             <p className="text-[5px] text-gray-700 mt-0.5">
                Fait à {data.zone}, le {new Date().toLocaleDateString('fr-FR')}. Pour TAMBUA RDC.
            </p>
          </div>
        </div>

        {/* QR Code */}
        <div className="absolute bottom-[5px] right-[5px] z-20">
            <QRCodeGenerator text={qrCodeText} size={38} />
        </div>
      </div>
    </div>
  );
};

export default PrintableMotorcycleAttestation;