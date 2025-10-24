import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { ModalHeader } from './AgentFormComponents';
import PdfPreviewModal from './PdfPreviewModal';
import PrintableLicense from './PrintableLicense';

const MOCK_LICENSE_DB: { [key: string]: any } = {
    'P123456789': {
        licenseNumber: 'P123456789',
        lastName: 'MUKADI',
        firstName: 'JEAN-LUC',
        dob: '1985-05-15',
        issueDate: '2023-01-10',
        expiryDate: '2028-01-09',
        categories: ['A', 'B'],
        photoUrl: 'https://i.pravatar.cc/150?u=jeanluc',
        nationality: 'Congolaise (RDC)',
    }
};

interface PrintLicenseModalProps {
  onClose: () => void;
}

const PrintLicenseModal: React.FC<PrintLicenseModalProps> = ({ onClose }) => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundLicense, setFoundLicense] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNumber.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setFoundLicense(null);
    
    setTimeout(() => {
      const normalizedNumber = licenseNumber.trim().toUpperCase();
      const license = MOCK_LICENSE_DB[normalizedNumber];
      if (license) {
        setFoundLicense(license);
      } else {
        setError(`Aucun permis trouvé pour le numéro "${normalizedNumber}".`);
      }
      setIsLoading(false);
    }, 1000);
  };

  if (foundLicense) {
    return (
        <PdfPreviewModal title={`Permis ${foundLicense.licenseNumber}`} onClose={onClose}>
            <PrintableLicense data={foundLicense} />
        </PdfPreviewModal>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <ModalHeader title="Imprimer un Permis" onClose={onClose} color="blue" />
        <form onSubmit={handleSearch} className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Rechercher un permis</h3>
          <p className="text-sm text-gray-500 mb-6">Entrez le numéro du permis de conduire à imprimer.</p>
          <div className="relative max-w-sm mx-auto">
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Ex: P123456789"
              className="w-full text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 py-3 px-4"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          <button type="submit" disabled={isLoading} className="mt-6 w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {isLoading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrintLicenseModal;
