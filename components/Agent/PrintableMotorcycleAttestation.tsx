import React from 'react';

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
  };
}

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[6px] uppercase text-gray-500 tracking-wider">{label}</p>
        <p className="text-[8px] font-bold uppercase font-mono">{value}</p>
    </div>
);

const PrintableMotorcycleAttestation: React.FC<PrintableMotorcycleAttestationProps> = ({ data }) => {
  return (
    <div className="printable-area print-card-format">
      <div className="w-[85.6mm] h-[53.98mm] bg-green-50 border border-green-200 rounded-lg shadow-md p-2 flex flex-col font-sans relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
            <p className="text-7xl font-black text-green-500 opacity-10 rotate-[-20deg]">MOTO</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-dotted border-green-300 pb-1 z-10">
          <div className="text-left">
            <p className="text-[8px] font-bold text-green-800">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
            <p className="text-[7px] text-green-700 font-semibold">ATTESTATION DE PROPRIÉTÉ - MOTO</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 flex pt-2 z-10">
          <div className="w-full space-y-1">
            <Field label="N° PLAQUE" value={data.plate} />
            <Field label="PROPRIÉTAIRE" value={data.owner} />
            <Field label="MARQUE / MODÈLE" value={data.makeModel} />
            <Field label="N° CHÂSSIS" value={data.chassis} />
             <div className="grid grid-cols-3 gap-x-2">
                <Field label="ANNÉE" value={data.year} />
                <Field label="COULEUR" value={data.color} />
                <Field label="QR CODE" value={data.qrCode} />
            </div>
             <p className="text-[6px] text-gray-500 mt-1">
                Fait à Goma, le {new Date().toLocaleDateString('fr-FR')}. Pour TAMBUA RDC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableMotorcycleAttestation;