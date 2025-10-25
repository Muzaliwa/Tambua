import React, { useState } from 'react';
import { FileText, Car, Bike } from 'lucide-react';
import PrintLicenseModal from '../components/Agent/PrintLicenseModal';
import PrintPinkCardModal from '../components/Agent/PrintPinkCardModal';
import PrintAttestationModal from '../components/Agent/PrintAttestationModal';

interface PrintActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}

const PrintActionCard: React.FC<PrintActionCardProps> = ({ title, description, icon: Icon, onClick, color }) => (
    <button
        onClick={onClick}
        className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--brand-400]"
    >
        <div className="flex items-start">
            <div className={`p-3 rounded-full inline-block mr-4`} style={{ backgroundColor: `${color}20` }}>
                <Icon className="w-8 h-8" style={{ color: color }} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-[--text-main] mb-1">{title}</h3>
                <p className="text-sm text-[--text-muted]">{description}</p>
            </div>
        </div>
    </button>
);


const PrintingPage: React.FC = () => {
    const [modal, setModal] = useState<'license' | 'pink_card' | 'attestation' | null>(null);

    return (
        <>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-main]">Centre d'Impression</h1>
                    <p className="text-sm text-[--text-muted]">Sélectionnez le type de document à imprimer.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PrintActionCard
                        title="Permis de Conduire"
                        description="Imprimer un nouveau permis de conduire pour un citoyen."
                        icon={FileText}
                        color="var(--accent-blue)"
                        onClick={() => setModal('license')}
                    />
                    <PrintActionCard
                        title="Carte Rose"
                        description="Imprimer le certificat d'immatriculation pour une voiture."
                        icon={Car}
                        color="var(--accent-pink)"
                        onClick={() => setModal('pink_card')}
                    />
                    <PrintActionCard
                        title="Attestation Moto"
                        description="Imprimer l'attestation de propriété pour une moto."
                        icon={Bike}
                        color="#10B981"
                        onClick={() => setModal('attestation')}
                    />
                </div>
            </div>

            {modal === 'license' && <PrintLicenseModal onClose={() => setModal(null)} />}
            {modal === 'pink_card' && <PrintPinkCardModal onClose={() => setModal(null)} />}
            {modal === 'attestation' && <PrintAttestationModal onClose={() => setModal(null)} />}
        </>
    );
};

export default PrintingPage;