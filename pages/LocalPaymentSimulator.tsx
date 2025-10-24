import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, Printer } from 'lucide-react';
import PrintableReceipt from '../components/Agent/PrintableReceipt';

interface Fine {
  id: string;
  reason: string;
  amount: number;
  date: string;
}

const MOCK_FINES_DB: { [key: string]: Fine[] } = {
  'GOM 1005 AB': [
    { id: '1a', reason: 'Excès de vitesse', amount: 80000, date: '2025-10-08' },
    { id: '1b', reason: 'Feu rouge grillé', amount: 60000, date: '2025-09-21' },
    { id: '1c', reason: 'Assurance expirée', amount: 200000, date: '2025-08-15' },
  ],
  'BB123C': [
    { id: '2a', reason: 'Stationnement interdit', amount: 50000, date: '2025-10-06' },
  ],
};

const PAYMENT_METHODS = ['Airtel Money', 'Orange Money', 'M-Pesa', 'Liquide'];

type Step = 'search' | 'select' | 'pay' | 'receipt';

const LocalPaymentSimulator: React.FC = () => {
  const [step, setStep] = useState<Step>('search');
  const [plate, setPlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundFines, setFoundFines] = useState<Fine[]>([]);
  const [selectedFineIds, setSelectedFineIds] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const navigate = useNavigate();
  
  const selectedFines = useMemo(() => 
    foundFines.filter(fine => selectedFineIds.has(fine.id)),
    [foundFines, selectedFineIds]
  );

  const totalAmount = useMemo(() => 
    selectedFines.reduce((sum, fine) => sum + fine.amount, 0),
    [selectedFines]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      const normalizedPlate = plate.trim().toUpperCase();
      const fines = MOCK_FINES_DB[normalizedPlate];
      if (fines) {
        setFoundFines(fines);
        setStep('select');
      } else {
        setError(`Aucune infraction trouvée pour la plaque "${normalizedPlate}".`);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleFineSelection = (fineId: string) => {
    setSelectedFineIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fineId)) {
        newSet.delete(fineId);
      } else {
        newSet.add(fineId);
      }
      return newSet;
    });
  };

  const handleGoToPayment = () => {
    if (selectedFineIds.size > 0) {
      setStep('pay');
    }
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Veuillez sélectionner un mode de paiement.");
      return;
    }
    console.log("Payment Processed:", {
        plate,
        fines: selectedFines,
        total: totalAmount,
        method: paymentMethod,
    });
    setStep('receipt');
  };
  
  const handlePrint = () => {
      window.print();
  };
  
  const handleReturnToDashboard = () => {
    navigate('/agent-dashboard');
  };

  const renderContent = () => {
    switch (step) {
      case 'search':
        return (
          <form onSubmit={handleSearch} className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Rechercher une plaque</h3>
            <p className="text-sm text-gray-500 mb-6">Entrez le numéro de plaque pour trouver les amendes.</p>
            <div className="relative max-w-sm mx-auto">
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Ex: GOM 1005 AB"
                className="w-full text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:border-transparent focus:ring-2 focus:ring-red-500 py-3 px-4"
              />
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <button type="submit" disabled={isLoading} className="mt-6 w-full max-w-sm mx-auto flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300">
              {isLoading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Search className="w-5 h-5 mr-2" />}
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
        );
      case 'select':
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Infractions pour <span className="font-mono text-red-600">{plate}</span></h3>
            <p className="text-sm text-gray-500 mb-4">Cochez les amendes à payer.</p>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {foundFines.map(fine => (
                <label key={fine.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={selectedFineIds.has(fine.id)} onChange={() => handleFineSelection(fine.id)} className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                  <div className="ml-4 flex-grow">
                    <p className="font-medium text-gray-800">{fine.reason}</p>
                    <p className="text-xs text-gray-500">Date: {new Date(fine.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{fine.amount.toLocaleString()} FC</p>
                </label>
              ))}
            </div>
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">Total à payer</p>
                    <p className="text-2xl font-bold text-red-600">{totalAmount.toLocaleString()} FC</p>
                </div>
                <button onClick={handleGoToPayment} disabled={selectedFineIds.size === 0} className="px-6 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300">
                    Procéder au paiement
                </button>
            </div>
          </div>
        );
      case 'pay':
        return (
           <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Confirmation du paiement</h3>
              <div className="flex justify-between items-baseline bg-red-50 p-4 rounded-lg mb-4">
                  <span className="text-gray-600">Montant total:</span>
                  <span className="text-3xl font-bold text-red-700">{totalAmount.toLocaleString()} FC</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-3">Choisissez un mode de paiement :</p>
              <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map(method => (
                       <button key={method} onClick={() => setPaymentMethod(method)} className={`p-4 border rounded-lg text-center font-semibold transition-colors ${paymentMethod === method ? 'bg-red-600 text-white border-red-600 ring-2 ring-red-300' : 'bg-white hover:bg-gray-50'}`}>
                          {method}
                       </button>
                  ))}
              </div>
              <div className="mt-6 border-t pt-4 flex justify-end">
                   <button onClick={handlePayment} disabled={!paymentMethod} className="w-full px-6 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300">
                      Valider le paiement
                  </button>
              </div>
           </div>
        );
      case 'receipt':
        return (
            <div className="bg-gray-50 text-center">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Paiement effectué avec succès !</h3>
                <p className="text-sm text-gray-600 mb-4">Le reçu a été généré. Vous pouvez l'imprimer.</p>
                <div className="bg-white p-4 border rounded-lg shadow-md max-w-md mx-auto">
                   <PrintableReceipt plate={plate} paidFines={selectedFines} total={totalAmount} paymentMethod={paymentMethod} />
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button onClick={handlePrint} className="flex items-center justify-center px-6 py-3 font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-800">
                        <Printer className="w-5 h-5 mr-2"/>
                        Imprimer le reçu
                    </button>
                    <button onClick={handleReturnToDashboard} className="px-6 py-3 font-semibold text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
         <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Paiement d'Amendes</h1>
            <p className="text-sm text-gray-500">Suivez les étapes pour enregistrer un paiement.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LocalPaymentSimulator;