import React, { useState, useEffect } from 'react';
import { Search, Loader, AlertCircle, Printer } from 'lucide-react';
import { ModalHeader } from './AgentFormComponents';
import PrintableMotorcycleAttestation from './PrintableMotorcycleAttestation';

interface AttestationData {
  plate: string;
  owner: string;
  address: string;
  makeModel: string;
  year: string;
  chassis: string;
  color: string;
  qrCode: string;
  zone: string;
}

const MOCK_ATTESTATION_DB: { [key: string]: AttestationData } = {
  'GOM 456 CD': {
    plate: 'GOM 456 CD',
    owner: 'Kavira Mukeba',
    address: 'Goma',
    makeModel: 'TVS Star HLX 125',
    year: '2023',
    chassis: 'ME456789012345678',
    color: 'Rouge',
    qrCode: 'QR-GOM-456-CD',
    zone: 'Goma',
  },
  'GOM 789 EF': {
    plate: 'GOM 789 EF',
    owner: 'Furaha Mutinga',
    address: 'Goma',
    makeModel: 'Haojue 150',
    year: '2022',
    chassis: 'LPR12345678901234',
    color: 'Noire',
    qrCode: 'QR-GOM-789-EF',
    zone: 'Goma',
  }
};

interface PrintAttestationModalProps {
  onClose: () => void;
}

// A dedicated component to handle the print lifecycle
const PrintView: React.FC<{ data: AttestationData; onPrintFinish: () => void }> = ({ data, onPrintFinish }) => {
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

  return <PrintableMotorcycleAttestation data={data} />;
};


const PrintAttestationModal: React.FC<PrintAttestationModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attestationData, setAttestationData] = useState<AttestationData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setAttestationData(null);

    setTimeout(() => {
       const term = searchTerm.trim().toLowerCase();
       const data = Object.values(MOCK_ATTESTATION_DB).find(
        attestation =>
          attestation.plate.toLowerCase() === term ||
          attestation.owner.toLowerCase().includes(term)
      );

      if (data) {
        setAttestationData(data);
      } else {
        setError(`Aucune attestation trouvée pour "${searchTerm}".`);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePrint = () => {
    if (attestationData) {
      setIsPrinting(true);
    }
  };
  
  const handleReset = () => {
      setSearchTerm('');
      setAttestationData(null);
      setError(null);
  }

  return (
    <>
      {isPrinting && attestationData && (
        <PrintView data={attestationData} onPrintFinish={() => setIsPrinting(false)} />
      )}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 ${isPrinting ? 'no-print' : ''}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <ModalHeader title="Imprimer une Attestation Moto" onClose={onClose} color="green" />
          
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="N° de plaque ou nom du propriétaire..."
                className="flex-grow bg-white border border-black/10 rounded-md shadow-sm text-sm p-2 text-[--text-main]"
              />
              <button type="submit" disabled={isLoading} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300">
                {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </form>

            <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {error && <div className="text-center text-red-600 min-h-[200px] flex flex-col justify-center items-center"><AlertCircle className="mx-auto w-8 h-8 mb-2" />{error}</div>}
              {!error && !attestationData && !isLoading && <div className="text-center text-gray-500 min-h-[200px] flex justify-center items-center">Veuillez rechercher pour voir l'aperçu.</div>}
              {isLoading && <div className="min-h-[200px] flex justify-center items-center"><Loader className="animate-spin w-8 h-8 text-green-600" /></div>}
              {attestationData && <PrintableMotorcycleAttestation data={attestationData} />}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <button type="button" onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Nouvelle recherche
              </button>
              <button
                  onClick={handlePrint}
                  disabled={!attestationData}
                  className="flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300"
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

export default PrintAttestationModal;