import React, { useState } from 'react';
import { Award, Contact, Bike } from 'lucide-react';
import PrintLicenseModal from '../components/Agent/PrintLicenseModal';
import PrintPinkCardModal from '../components/Agent/PrintPinkCardModal';
import PrintAttestationModal from '../components/Agent/PrintAttestationModal';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    <div className={`p-3 rounded-full inline-block mb-4`} style={{ backgroundColor: `${color}20`}}>
      <Icon className="w-8 h-8" style={{ color: color }} />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </button>
);

const PrintingPage: React.FC = () => {
  const [modal, setModal] = useState<'license' | 'pink_card' | 'attestation' | null>(null);

  const actions = [
    { id: 'license', title: 'Imprimer Permis', description: 'Rechercher et imprimer un permis de conduire.', icon: Contact, color: '#3B82F6', action: () => setModal('license') },
    { id: 'pink_card', title: 'Imprimer Carte Rose', description: 'Imprimer le certificat d\'immatriculation d\'un véhicule.', icon: Award, color: '#EC4899', action: () => setModal('pink_card') },
    { id: 'attestation', title: 'Imprimer Attestation', description: 'Imprimer une attestation de propriété pour une moto.', icon: Bike, color: '#10B981', action: () => setModal('attestation') },
  ];

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Centre d'Impression</h1>
          <p className="text-sm text-gray-500">
            Recherchez et imprimez les documents officiels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <ActionCard key={action.id} {...action} onClick={action.action} />
          ))}
        </div>
      </div>

      {modal === 'license' && <PrintLicenseModal onClose={() => setModal(null)} />}
      {modal === 'pink_card' && <PrintPinkCardModal onClose={() => setModal(null)} />}
      {modal === 'attestation' && <PrintAttestationModal onClose={() => setModal(null)} />}
    </>
  );
};

export default PrintingPage;