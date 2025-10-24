import React from 'react';

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
  };
}

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[6px] uppercase text-gray-500 tracking-wider">{label}</p>
        <p className="text-[8px] font-bold uppercase">{value}</p>
    </div>
);

const PrintableLicense: React.FC<PrintableLicenseProps> = ({ data }) => {
  return (
    <div className="printable-area print-card-format">
      <div className="w-[85.6mm] h-[53.98mm] bg-white border border-gray-300 rounded-lg shadow-md p-2 flex flex-col font-sans relative overflow-hidden">
        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
            <p className="text-6xl font-black text-blue-50 opacity-80 rotate-[-20deg]">RDC</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-1 z-10">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-400 mr-1"></div>
            <div className="w-6 h-6 bg-blue-600 mr-1"></div>
            <div className="w-6 h-6 bg-red-600"></div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-bold">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>
            <p className="text-[7px] text-blue-700 font-semibold">PERMIS DE CONDUIRE</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 flex pt-2 z-10">
          {/* Left Side - Photo & Info */}
          <div className="w-1/3 pr-2 flex flex-col justify-between">
            <img src={data.photoUrl} alt="Photo" className="w-full h-auto border-2 border-blue-600 mb-1" />
            <Field label="Nationalité" value={data.nationality} />
            <Field label="N° Permis" value={data.licenseNumber} />
          </div>

          {/* Right Side - Details */}
          <div className="w-2/3 pl-2 space-y-1">
            <Field label="1. Nom" value={data.lastName} />
            <Field label="2. Prénom" value={data.firstName} />
            <Field label="3. Date de Naissance" value={new Date(data.dob).toLocaleDateString('fr-FR')} />
            <div className="flex justify-between">
                <Field label="4a. Délivré le" value={new Date(data.issueDate).toLocaleDateString('fr-FR')} />
                <Field label="4b. Expire le" value={new Date(data.expiryDate).toLocaleDateString('fr-FR')} />
            </div>
            <Field label="9. Catégories" value={data.categories.join(', ')} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrintableLicense;
