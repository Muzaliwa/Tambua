import React, { useState, useEffect } from 'react';
import { Search, Loader, AlertCircle, Printer } from 'lucide-react';
import { ModalHeader } from './AgentFormComponents';
import PrintableLicense from './PrintableLicense';

interface LicenseData {
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
}

const MOCK_LICENSE_DB: { [key: string]: LicenseData } = {
  'P123456789': {
    licenseNumber: 'P123456789',
    lastName: 'Tambua',
    firstName: 'Agent',
    dob: '1990-05-15',
    issueDate: '2023-10-01',
    expiryDate: '2028-09-30',
    categories: ['B', 'C'],
    photoUrl: 'https://picsum.photos/seed/agent/200/200',
    nationality: 'Congolaise',
    zone: 'Goma',
  },
  'P987654321': {
    licenseNumber: 'P987654321',
    lastName: 'Mukeba',
    firstName: 'Salomon',
    dob: '1985-02-20',
    issueDate: '2022-08-12',
    expiryDate: '2027-08-11',
    categories: ['A', 'B'],
    photoUrl: 'https://picsum.photos/seed/salomon/200/200',
    nationality: 'Congolaise',
    zone: 'Kinshasa',
  }
};

interface PrintLicenseModalProps {
  onClose: () => void;
}

// A dedicated component to handle the print lifecycle
const PrintView: React.FC<{ data: LicenseData; onPrintFinish: () => void }> = ({ data, onPrintFinish }) => {
  useEffect(() => {
    const handleAfterPrint = () => {
      onPrintFinish();
    };

    window.addEventListener('afterprint', handleAfterPrint);
    window.print();

    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [onPrintFinish]);

  return <PrintableLicense data={data} />;
};

const PrintLicenseModal: React.FC<PrintLicenseModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setLicenseData(null);

    setTimeout(() => {
      const term = searchTerm.trim().toLowerCase();
      const data = Object.values(MOCK_LICENSE_DB).find(
        license =>
          license.licenseNumber.toLowerCase() === term ||
          `${license.firstName} ${license.lastName}`.toLowerCase().includes(term) ||
          license.lastName.toLowerCase().includes(term) ||
          license.firstName.toLowerCase().includes(term)
      );

      if (data) {
        setLicenseData(data);
      } else {
        setError(`Aucun permis trouvé pour "${searchTerm}".`);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePrint = () => {
    if(licenseData) {
      setIsPrinting(true);
    }
  };
  
  const handleReset = () => {
      setSearchTerm('');
      setLicenseData(null);
      setError(null);
  }

  return (
    <>
      {isPrinting && licenseData && (
        <PrintView data={licenseData} onPrintFinish={() => setIsPrinting(false)} />
      )}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 ${isPrinting ? 'no-print' : ''}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <ModalHeader title="Imprimer un Permis de Conduire" onClose={onClose} color="blue" />
          
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="N° de permis ou nom du propriétaire..."
                className="flex-grow bg-white border border-black/10 rounded-md shadow-sm text-sm p-2 text-[--text-main]"
              />
              <button type="submit" disabled={isLoading} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[--brand-400] rounded-lg hover:bg-[--brand-600] disabled:bg-blue-300">
                {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </form>

            <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {error && <div className="text-center text-red-600 min-h-[200px] flex flex-col justify-center items-center"><AlertCircle className="mx-auto w-8 h-8 mb-2" />{error}</div>}
              {!error && !licenseData && !isLoading && <div className="text-center text-gray-500 min-h-[200px] flex justify-center items-center">Veuillez rechercher pour voir l'aperçu.</div>}
              {isLoading && <div className="min-h-[200px] flex justify-center items-center"><Loader className="animate-spin w-8 h-8 text-[--brand-400]" /></div>}
              {licenseData && <PrintableLicense data={licenseData} />}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <button type="button" onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Nouvelle recherche
              </button>
              <button
                  onClick={handlePrint}
                  disabled={!licenseData}
                  className="flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-[--brand-400] rounded-lg hover:bg-[--brand-600] disabled:bg-blue-300"
              >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
              </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default PrintLicenseModal;