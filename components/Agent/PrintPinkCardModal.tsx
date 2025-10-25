import React, { useState, useEffect } from 'react';
import { Search, Loader, AlertCircle, Printer } from 'lucide-react';
import { ModalHeader } from './AgentFormComponents';
import PrintablePinkCard from './PrintablePinkCard';

interface PinkCardData {
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
}

const MOCK_PINK_CARD_DB: { [key: string]: PinkCardData } = {
  'GOM45D': {
    plate: 'GOM45D',
    owner: 'Marie',
    address: 'Goma',
    make: 'Mercedes',
    model: 'C300',
    year: '2018',
    chassis: 'WDD1234567890123',
    color: 'Blanche',
    issueDate: '2023-01-20',
    zone: 'Goma',
  },
  'BB123C': {
    plate: 'BB123C',
    owner: 'Richard',
    address: 'Bukavu',
    make: 'Toyota',
    model: 'Rav4',
    year: '2000',
    chassis: 'JTE1234567890123',
    color: 'Verte',
    issueDate: '2022-05-10',
    zone: 'Bukavu',
  }
};

interface PrintPinkCardModalProps {
  onClose: () => void;
}

// A dedicated component to handle the print lifecycle
const PrintView: React.FC<{ data: PinkCardData; onPrintFinish: () => void }> = ({ data, onPrintFinish }) => {
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

  return <PrintablePinkCard data={data} />;
};

const PrintPinkCardModal: React.FC<PrintPinkCardModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<PinkCardData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setCardData(null);

    setTimeout(() => {
      const term = searchTerm.trim().toLowerCase();
      const data = Object.values(MOCK_PINK_CARD_DB).find(
        card =>
          card.plate.toLowerCase() === term ||
          card.owner.toLowerCase().includes(term)
      );

      if (data) {
        setCardData(data);
      } else {
        setError(`Aucune carte rose trouvée pour "${searchTerm}".`);
      }
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePrint = () => {
    if(cardData) {
      setIsPrinting(true);
    }
  };
  
  const handleReset = () => {
      setSearchTerm('');
      setCardData(null);
      setError(null);
  }

  return (
    <>
      {isPrinting && cardData && (
        <PrintView data={cardData} onPrintFinish={() => setIsPrinting(false)} />
      )}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4 ${isPrinting ? 'no-print' : ''}`}>
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full">
          <ModalHeader title="Imprimer une Carte Rose" onClose={onClose} color="red" />
          
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="N° de plaque ou nom du propriétaire..."
                className="flex-grow bg-white border border-black/10 rounded-md shadow-sm text-sm p-2 text-[--text-main]"
              />
              <button type="submit" disabled={isLoading} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300">
                {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </form>

            <div className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {error && <div className="text-center text-red-600 min-h-[200px] flex flex-col justify-center items-center"><AlertCircle className="mx-auto w-8 h-8 mb-2" />{error}</div>}
              {!error && !cardData && !isLoading && <div className="text-center text-gray-500 min-h-[200px] flex justify-center items-center">Veuillez rechercher pour voir l'aperçu.</div>}
              {isLoading && <div className="min-h-[200px] flex justify-center items-center"><Loader className="animate-spin w-8 h-8 text-red-600" /></div>}
              {cardData && <PrintablePinkCard data={cardData} />}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <button type="button" onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Nouvelle recherche
              </button>
              <button
                  onClick={handlePrint}
                  disabled={!cardData}
                  className="flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300"
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

export default PrintPinkCardModal;