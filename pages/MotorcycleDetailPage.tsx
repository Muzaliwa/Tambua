import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Motorcycle, Fine, Infraction } from '../types';
import { ChevronLeft, Bike, User, FileText, CircleDollarSign } from 'lucide-react';

// --- MOCK DATA FOR DETAIL VIEW ---
const mockMotorcycles: Motorcycle[] = [
  { 
    id: '1', 
    photo: 'https://picsum.photos/seed/moto1/150/150', 
    owner: 'Kavira Mukeba', 
    address: 'Goma', 
    plate: 'GOM 456 CD', 
    makeModel: 'TVS Star HLX 125', 
    year: 2023, 
    color: 'Rouge',
    // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
    documentStatus: 'Bientôt expiré',
    insuranceStatus: 'Valide',
    infractions: [
        { id: 'a1b2c3d4', code: 'RDC-PARK-001', label: 'Stationnement interdit', description: 'Parking on a red line', severity: 'LEGER', amount: 40000, createdAt: '2025-09-15T11:30:00.000Z', updatedAt: '2025-09-15T11:30:00.000Z' },
    ],
    payments: []
  },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '2', photo: 'https://picsum.photos/seed/moto2/150/150', owner: 'Furaha Mutinga', address: 'Goma', plate: 'GOM 789 EF', makeModel: 'Haojue 150', year: 2022, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Expiré' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '3', photo: 'https://picsum.photos/seed/moto3/150/150', owner: 'Agent Tambua', address: 'Goma', plate: 'GOM 101 GH', makeModel: 'Boxer BM 150', year: 2024, color: 'Bleue', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];


const DetailCard: React.FC<{title: string, icon: React.ElementType, children: React.ReactNode}> = ({title, icon: Icon, children}) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
            <Icon className="w-6 h-6 text-green-600 mr-3"/>
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

const DetailRow: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
    </div>
);

const MotorcycleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const motorcycle = mockMotorcycles.find(m => m.id === id);

  if (!motorcycle) {
    return <div className="p-4">Moto non trouvée.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/motorcycles" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour à la liste des motos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Dossier de la Moto: <span className="font-mono">{motorcycle.plate}</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
            <DetailCard title="Informations de la Moto" icon={Bike}>
                <dl>
                    <DetailRow label="Plaque" value={<span className="font-mono font-semibold">{motorcycle.plate}</span>} />
                    <DetailRow label="Marque / Modèle" value={motorcycle.makeModel} />
                    <DetailRow label="Année" value={motorcycle.year} />
                    <DetailRow label="Couleur" value={motorcycle.color} />
                </dl>
            </DetailCard>
             <DetailCard title="Propriétaire" icon={User}>
                <dl>
                    <DetailRow label="Nom" value={motorcycle.owner} />
                    <DetailRow label="Adresse" value={motorcycle.address} />
                </dl>
            </DetailCard>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
             <DetailCard title="Historique des Infractions" icon={FileText}>
                {motorcycle.infractions && motorcycle.infractions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-gray-500"><tr><th className="p-2">Date</th><th className="p-2">Infraction</th><th className="p-2">Montant</th></tr></thead>
                            <tbody>{motorcycle.infractions.map(inf => <tr key={inf.id} className="border-t"><td className="p-2">{new Date(inf.createdAt).toLocaleDateString()}</td><td className="p-2">{inf.label}</td><td className="p-2">{inf.amount.toLocaleString()} FC</td></tr>)}</tbody>
                        </table>
                    </div>
                ) : <p className="text-sm text-gray-500">Aucune infraction enregistrée.</p>}
            </DetailCard>
            <DetailCard title="Historique des Paiements" icon={CircleDollarSign}>
                 {motorcycle.payments && motorcycle.payments.length > 0 ? (
                    <div className="overflow-x-auto">
                         <table className="min-w-full text-sm">
                            <thead className="text-left text-gray-500"><tr><th className="p-2">Date</th><th className="p-2">Motif</th><th className="p-2">Montant</th><th className="p-2">Statut</th></tr></thead>
                            <tbody>{motorcycle.payments.map(p => <tr key={p.id} className="border-t"><td className="p-2">{new Date(p.date).toLocaleDateString()}</td><td className="p-2">{p.reason}</td><td className="p-2">{p.amount.toLocaleString()} FC</td><td className="p-2"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{p.status}</span></td></tr>)}</tbody>
                        </table>
                    </div>
                ) : <p className="text-sm text-gray-500">Aucun paiement enregistré.</p>}
            </DetailCard>
        </div>
      </div>
    </div>
  );
};

export default MotorcycleDetailPage;