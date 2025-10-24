import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vehicle, Fine, Infraction } from '../types';
import { ChevronLeft, Car, User, FileText, CircleDollarSign } from 'lucide-react';

// --- MOCK DATA FOR DETAIL VIEW ---
const mockVehicles: Vehicle[] = [
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '1', photo: 'https://picsum.photos/seed/salomon/150/150', owner: 'Salomon', address: 'Goma', taxId: 'NA', plate: '1234AB', makeModel: 'Nissan Juke', year: 2000, color: 'Rouge', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { 
    id: '2', 
    photo: 'https://picsum.photos/seed/richard/150/150', 
    owner: 'Richard', 
    address: 'Bukavu', 
    taxId: '0922', 
    plate: 'BB123C', 
    makeModel: 'Toyota Rav4', 
    year: 2000, 
    color: 'Verte',
    // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
    documentStatus: 'Expiré',
    insuranceStatus: 'Valide',
    infractions: [
        { id: 'e8f45c45', code: 'RDC-SEC-099', label: 'Excès de vitesse', description: 'Dépassement de la limite de vitesse autorisée en zone urbaine.', severity: 'GRAVE', amount: 120000, createdAt: '2025-10-20T09:02:50.531Z', updatedAt: '2025-10-20T09:02:50.531Z' },
    ],
    payments: [
        { id: '1', plate: 'BB123C', reason: 'Assurance expirée', driver: 'Richard', location: 'Keshero', date: '07/10/2025', amount: 200000, currency: 'CDF', status: 'Payée' }
    ]
  },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '3', photo: 'https://picsum.photos/seed/jean/150/150', owner: 'Jean', address: 'Kinshasa', taxId: '1023', plate: 'KIN89Z', makeModel: 'Honda CRV', year: 2015, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Bientôt expiré' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '4', photo: 'https://picsum.photos/seed/marie/150/150', owner: 'Marie', address: 'Goma', taxId: '4589', plate: 'GOM45D', makeModel: 'Mercedes C300', year: 2018, color: 'Blanche', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const DetailCard: React.FC<{title: string, icon: React.ElementType, children: React.ReactNode}> = ({title, icon: Icon, children}) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center mb-4">
            <Icon className="w-6 h-6 text-blue-600 mr-3"/>
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

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vehicle = mockVehicles.find(v => v.id === id);

  if (!vehicle) {
    return <div className="p-4">Véhicule non trouvé.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/vehicles" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour à la liste des voitures
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Dossier du Véhicule: <span className="font-mono">{vehicle.plate}</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
            <DetailCard title="Informations du Véhicule" icon={Car}>
                <dl>
                    <DetailRow label="Plaque" value={<span className="font-mono font-semibold">{vehicle.plate}</span>} />
                    <DetailRow label="Marque / Modèle" value={vehicle.makeModel} />
                    <DetailRow label="Année" value={vehicle.year} />
                    <DetailRow label="Couleur" value={vehicle.color} />
                </dl>
            </DetailCard>
             <DetailCard title="Propriétaire" icon={User}>
                <dl>
                    <DetailRow label="Nom" value={vehicle.owner} />
                    <DetailRow label="Adresse" value={vehicle.address} />
                    <DetailRow label="N° Impôt" value={vehicle.taxId} />
                </dl>
            </DetailCard>
        </div>
        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
             <DetailCard title="Historique des Infractions" icon={FileText}>
                {vehicle.infractions && vehicle.infractions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-gray-500"><tr><th className="p-2">Date</th><th className="p-2">Infraction</th><th className="p-2">Montant</th></tr></thead>
                            <tbody>{vehicle.infractions.map(inf => <tr key={inf.id} className="border-t"><td className="p-2">{new Date(inf.createdAt).toLocaleDateString()}</td><td className="p-2">{inf.label}</td><td className="p-2">{inf.amount.toLocaleString()} FC</td></tr>)}</tbody>
                        </table>
                    </div>
                ) : <p className="text-sm text-gray-500">Aucune infraction enregistrée.</p>}
            </DetailCard>
            <DetailCard title="Historique des Paiements" icon={CircleDollarSign}>
                 {vehicle.payments && vehicle.payments.length > 0 ? (
                    <div className="overflow-x-auto">
                         <table className="min-w-full text-sm">
                            <thead className="text-left text-gray-500"><tr><th className="p-2">Date</th><th className="p-2">Motif</th><th className="p-2">Montant</th><th className="p-2">Statut</th></tr></thead>
                            <tbody>{vehicle.payments.map(p => <tr key={p.id} className="border-t"><td className="p-2">{new Date(p.date).toLocaleDateString()}</td><td className="p-2">{p.reason}</td><td className="p-2">{p.amount.toLocaleString()} FC</td><td className="p-2"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{p.status}</span></td></tr>)}</tbody>
                        </table>
                    </div>
                ) : <p className="text-sm text-gray-500">Aucun paiement enregistré.</p>}
            </DetailCard>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;