import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayFineModal from '../components/Agent/PayFineModal';
import { CircleDollarSign } from 'lucide-react';

const LocalPaymentSimulator: React.FC = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(true);

    const handleClose = () => {
        setIsModalOpen(false);
        // Navigate back to the agent dashboard when closing the modal
        navigate('/agent-dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--brand-50] p-4">
            <div className="text-center max-w-md mx-auto">
                 <div className="w-24 h-24 bg-gradient-to-b from-white/90 to-white/85 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 shadow-glass border border-black/5">
                    <CircleDollarSign className="w-12 h-12" />
                </div>
                <h1 className="text-2xl font-bold text-[--text-main]">Simulateur de Paiement Local</h1>
                <p className="text-[--text-muted] mb-6">Prêt à traiter un paiement d'amende.</p>
                {!isModalOpen && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition-shadow"
                    >
                        Ouvrir le terminal de paiement
                    </button>
                )}
            </div>
            {isModalOpen && <PayFineModal onClose={handleClose} />}
        </div>
    );
};

export default LocalPaymentSimulator;