import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';

interface PrintableLicenseProps {
  data: {
    licenseNumber: string;
    lastName: string;
    firstName: string;
    dob: string;
    issueDate: string;
    expiryDate: string;
    categories: string[];
    photoUrl: string;
    nationality: string;
    zone: string;
  };
}

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[5.5px] uppercase text-gray-600 tracking-wide">{label}</p>
        <p className="text-[7px] font-bold uppercase text-black">{value}</p>
    </div>
);

const PrintableLicense: React.FC<PrintableLicenseProps> = ({ data }) => {
  const isExpired = new Date(data.expiryDate) < new Date();
  const qrCodeText = [
    `TYPE: PERMIS DE CONDUIRE`,
    `STATUT: ${isExpired ? 'Expiré' : 'Valide'}`,
    `NUMERO: ${data.licenseNumber}`,
    `NOM: ${data.lastName}`,
    `PRENOM: ${data.firstName}`,
    `DATE_NAISSANCE: ${new Date(data.dob).toLocaleDateString('fr-CA')}`,
    `DATE_EMISSION: ${new Date(data.issueDate).toLocaleDateString('fr-CA')}`,
    `DATE_EXPIRATION: ${new Date(data.expiryDate).toLocaleDateString('fr-CA')}`,
    `CATEGORIES: ${data.categories.join(', ')}`,
    `ZONE: ${data.zone}`
  ].join('\n');

  return (
    <div className="printable-area print-card-format">
      <div className="w-[85.6mm] h-[53.98mm] bg-white border border-gray-300 rounded-lg shadow-md p-[5px] flex flex-col font-sans relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
            <p className="text-[48px] font-black text-blue-50 opacity-60 rotate-[-20deg]">RDC</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-0.5 z-10">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 mr-1"></div>
            <div className="w-4 h-4 bg-blue-600 mr-1"></div>
            <div className="w-4 h-4 bg-red-600"></div>
          </div>
          <div className="text-right">
            <p className="text-[7px] font-bold text-black">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
            <p className="text-[6px] text-black font-semibold">PERMIS DE CONDUIRE</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 flex pt-1 z-10">
          {/* Left Side - Photo & Info */}
          <div className="w-1/3 pr-1 flex flex-col justify-between">
            <img src={data.photoUrl} alt="Photo" className="w-full h-auto border border-blue-600 mb-0.5" />
            <div className="space-y-0.5">
                <Field label="Nationalité" value={data.nationality} />
                <Field label="N° Permis" value={data.licenseNumber} />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="w-2/3 pl-1 space-y-0.5">
            <Field label="1. Nom" value={data.lastName} />
            <Field label="2. Prénom" value={data.firstName} />
            <Field label="3. Date de Naissance" value={new Date(data.dob).toLocaleDateString('fr-FR')} />
            <div className="flex justify-between">
                <Field label="4a. Délivré le" value={new Date(data.issueDate).toLocaleDateString('fr-FR')} />
                <Field label="4b. Expire le" value={new Date(data.expiryDate).toLocaleDateString('fr-FR')} />
            </div>
            <Field label="9. Catégories" value={data.categories.join(', ')} />
            <Field label="Zone d'émission" value={data.zone} />
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

export default PrintableLicense;