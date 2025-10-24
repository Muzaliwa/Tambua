import React from 'react';

interface Fine {
  id: string;
  reason: string;
  amount: number;
}

interface PrintableReceiptProps {
  plate: string;
  paidFines: Fine[];
  total: number;
  paymentMethod: string;
}

const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ plate, paidFines, total, paymentMethod }) => {
  const transactionId = `TX-${Date.now().toString().slice(-6)}`;
  const transactionDate = new Date().toLocaleString('fr-FR');

  return (
    // The parent div is for on-screen display. The `printable-area` div inside is what gets printed.
    <div id="receipt-container" className="font-sans text-gray-800">
      <div className="printable-area">
        <header className="text-center mb-4">
          <h1 className="text-xl font-bold">TAMBUA RDC</h1>
          <p className="text-xs">Reçu de Paiement d'Amende</p>
        </header>

        <div className="text-xs space-y-1 mb-4">
          <p><strong>Date:</strong> {transactionDate}</p>
          <p><strong>N° Transaction:</strong> {transactionId}</p>
          <p><strong>Plaque:</strong> <span className="font-mono font-bold">{plate}</span></p>
        </div>

        <table className="w-full text-xs mb-4">
          <thead>
            <tr className="border-b-2 border-dashed border-black">
              <th className="text-left font-bold py-1">Infraction</th>
              <th className="text-right font-bold py-1">Montant (FC)</th>
            </tr>
          </thead>
          <tbody>
            {paidFines.map(fine => (
              <tr key={fine.id} className="border-b border-dashed border-gray-300">
                <td className="py-1">{fine.reason}</td>
                <td className="text-right py-1">{fine.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-xs space-y-1">
            <div className="flex justify-between">
                <span>Mode de paiement:</span>
                <span className="font-semibold">{paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold border-t-2 border-dashed border-black pt-1 mt-2">
                <span>TOTAL PAYÉ:</span>
                <span>{total.toLocaleString()} FC</span>
            </div>
        </div>
        
        <footer className="text-center text-xs mt-6">
            <p>Merci de votre paiement.</p>
            <p className="font-bold">www.tambua.cd</p>
        </footer>
      </div>
    </div>
  );
};

export default PrintableReceipt;
