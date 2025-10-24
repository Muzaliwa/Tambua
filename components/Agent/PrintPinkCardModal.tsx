import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { ModalHeader } from './AgentFormComponents';
import PdfPreviewModal from './PdfPreviewModal';
import PrintablePinkCard from './PrintablePinkCard';

const MOCK_VEHICLE_DB: { [key: string]: any } = {
    'BB123C': {
        plate: 'BB123C',
        owner: 'RICHARD K.',
        address: 'BUKAVU, RDC',
        make: 'TOYOTA',
        model: 'RAV4',
        year: '2000',
        chassis: 'JTEHH20V-0045987',
        color: 'VERTE',
        issueDate: '2024-03-18',
    },
    'GOM45D': {
        plate: 'GOM45D',
        owner: 'MARIE L.',
        address: 'GOMA, RDC',
        make: 'MERCEDES',
        model: 'C300',
        year: '2018',
        chassis: 'WDD205048-1F45678',
        color: 'BLANCHE',
        issueDate: '2024-05-22',
    }
};

interface PrintPinkCardModalProps {
  onClose: () => void;
}

const PrintPinkCardModal: React.FC<PrintPinkCardModalProps> = ({ onClose }) => {
  const [plate, setPlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundVehicle, setFoundVehicle] = useState<any | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setFoundVehicle(null);
    
    setTimeout(() => {
      const normalizedPlate = plate.trim().toUpperCase();
      const vehicle = MOCK_VEHICLE_DB[normalizedPlate];
      if (vehicle) {
        setFoundVehicle(vehicle);
      } else {
        setError(`Aucun véhicule trouvé pour la plaque "${normalizedPlate}".`);
      }
      setIsLoading(false);
    }, 1000);
  };

  if (foundVehicle) {
    return (
        <PdfPreviewModal title={`Carte Rose ${foundVehicle.plate}`} onClose={onClose}>
            <PrintablePinkCard data={foundVehicle} />
        </PdfPreviewModal>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <ModalHeader title="Imprimer une Carte Rose" onClose={onClose} color="red" />
        <form onSubmit={handleSearch} className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Rechercher un véhicule</h3>
          <p className="text-sm text-gray-500 mb-6">Entrez la plaque d'immatriculation du véhicule.</p>
          <div className="relative max-w-sm mx-auto">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Ex: BB123C"
              className="w-full text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-pink-500 py-3 px-4"
            />
          </div>
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
          <button type="submit" disabled={isLoading} className="mt-6 w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-pink-600 rounded-lg hover:bg-pink-700 disabled:bg-pink-300">
            {isLoading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrintPinkCardModal;
