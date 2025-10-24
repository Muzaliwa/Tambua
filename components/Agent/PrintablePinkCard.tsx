import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';

interface PrintablePinkCardProps {
  data: {
    plate: string;
    owner: string;
    address: string;
    make: string;
    model: string;
    year: string;
    chassis: string;
    color: string;
    issueDate: string;
    zone: string;
  };
}

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[6px] uppercase text-gray-700 tracking-wider">{label}</p>
        <p className="text-[8px] font-bold uppercase font-mono text-black">{value}</p>
    </div>
);

const PrintablePinkCard: React.FC<PrintablePinkCardProps> = ({ data }) => {
  const qrCodeText = [
    `TYPE: CARTE ROSE (CERTIFICAT D'IMMATRICULATION)`,
    `STATUT: Valide`,
    `PLAQUE: ${data.plate}`,
    `PROPRIETAIRE: ${data.owner}`,
    `ADRESSE: ${data.address}`,
    `MARQUE: ${data.make}`,
    `MODELE: ${data.model}`,
    `CHASSIS: ${data.chassis}`,
    `ANNEE: ${data.year}`,
    `DATE_EMISSION: ${new Date(data.issueDate).toLocaleDateString('fr-CA')}`,
    `ZONE: ${data.zone}`
  ].join('\n');
  
  return (
    <div className="printable-area print-card-format">
      <div className="w-[85.6mm] h-[53.98mm] bg-pink-50 border border-pink-200 rounded-lg shadow-md p-2 flex flex-col font-sans relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
            <p className="text-7xl font-black text-pink-500 opacity-10 rotate-[-20deg]">RDC</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dotted border-pink-300 pb-1 z-10">
          <div className="text-left">
            <p className="text-[8px] font-bold text-black">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
            <p className="text-[7px] text-black font-semibold">CERTIFICAT D'IMMATRICULATION</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 flex pt-2 z-10">
          <div className="w-full space-y-1">
            <Field label="A. N° IMMATRICULATION" value={data.plate} />
            <Field label="C.1 NOM & ADRESSE" value={`${data.owner}, ${data.address}`} />
            <div className="grid grid-cols-2 gap-x-2">
                <Field label="D.1 MARQUE" value={data.make} />
                <Field label="D.3 MODÈLE" value={data.model} />
            </div>
            <Field label="E. N° CHÂSSIS" value={data.chassis} />
             <div className="grid grid-cols-4 gap-x-2">
                <Field label="F.1 ANNÉE" value={data.year} />
                <Field label="J. COULEUR" value={data.color} />
                <Field label="B. DATE ÉMISSION" value={new Date(data.issueDate).toLocaleDateString('fr-FR')} />
                <Field label="ZONE" value={data.zone} />
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="absolute bottom-1 right-1 z-20">
            <QRCodeGenerator text={qrCodeText} size={48} />
        </div>
      </div>
    </div>
  );
};

export default PrintablePinkCard;