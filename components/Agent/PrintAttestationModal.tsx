import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { ModalHeader } from './AgentFormComponents';
import PdfPreviewModal from './PdfPreviewModal';
import PrintableMotorcycleAttestation from './PrintableMotorcycleAttestation';

const MOCK_MOTO_DB: { [key: string]: any } = {
    'GOM 456 CD': {
        plate: 'GOM 456 CD',
        owner: 'KAVIRA MUKEBA',
        address: 'GOMA, RDC',
        makeModel: 'TVS STAR HLX 125',
        year: '2023',
        chassis: 'MD625K32L8F12345',
        color: 'ROUGE',
        qrCode: 'TAMBUA-MOTO-12345',
        zone: 'Goma',
    },
    'GOM 789 EF': {
        plate: 'GOM 789 EF',
        owner: 'FURAHA MUTINGA',
        address: 'GOMA, RDC',
        makeModel: 'HAOJUE 150',
        year: '2022',
        chassis: 'LPRPCJ-F48975612',
        color: 'NOIRE',
        qrCode: 'TAMBUA-MOTO-67890',
        zone: 'Goma',
    }
};

interface PrintAttestationModalProps {
  onClose: () => void;
}

const PrintAttestationModal: React.FC<PrintAttestationModalProps> = ({ onClose }) => {
  const [plate, setPlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundMoto, setFoundMoto] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setFoundMoto(null);
    
    setTimeout(() => {
      const normalizedPlate = plate.trim().toUpperCase();
      const moto = MOCK_MOTO_DB[normalizedPlate];
      if (moto) {
        setFoundMoto(moto);
      } else {
        setError(`Aucune moto trouvée pour la plaque "${normalizedPlate}".`);
      }
      setIsLoading(false);
    }, 1000);
  };

  if (foundMoto) {
    return (
        <PdfPreviewModal title={`Attestation ${foundMoto.plate}`} onClose={onClose}>
            <PrintableMotorcycleAttestation data={foundMoto} />
        </PdfPreviewModal>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <ModalHeader title="Imprimer une Attestation" onClose={onClose} color="green" />
        <form onSubmit={handleSearch} className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Rechercher une moto</h3>
          <p className="text-sm text-gray-500 mb-6">Entrez la plaque d'immatriculation de la moto.</p>
          <div className="relative max-w-sm mx-auto">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Ex: GOM 456 CD"
              className="w-full text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-green-500 py-3 px-4"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          <button type="submit" disabled={isLoading} className="mt-6 w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300">
            {isLoading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrintAttestationModal;