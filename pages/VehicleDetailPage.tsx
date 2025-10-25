import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Vehicle, Fine } from '../types';
import { ChevronLeft, Car, ShieldCheck, ShieldOff, FileText, CircleDollarSign } from 'lucide-react';

// --- MOCK DATA (Should be fetched from an API in a real app) ---
const mockVehicles: Vehicle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/salomon/200/200', owner: 'Salomon', address: 'Goma', taxId: 'NA', plate: '1234AB', makeModel: 'Nissan Juke', year: 2000, color: 'Rouge', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/richard/200/200', owner: 'Richard', address: 'Bukavu', taxId: '0922', plate: 'BB123C', makeModel: 'Toyota Rav4', year: 2000, color: 'Verte', documentStatus: 'Expiré', insuranceStatus: 'Valide' },
  { id: '3', photo: 'https://picsum.photos/seed/jean/200/200', owner: 'Jean', address: 'Kinshasa', taxId: '1023', plate: 'KIN89Z', makeModel: 'Honda CRV', year: 2015, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Bientôt expiré' },
  { id: '4', photo: 'https://picsum.photos/seed/marie/200/200', owner: 'Marie', address: 'Goma', taxId: '4589', plate: 'GOM45D', makeModel: 'Mercedes C300', year: 2018, color: 'Blanche', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '5', photo: 'https://picsum.photos/seed/paul/200/200', owner: 'Paul', address: 'Kinshasa', taxId: '7854', plate: 'KIN22X', makeModel: 'Ford Ranger', year: 2021, color: 'Grise', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const mockFines: Fine[] = [
    { id: '1', plate: 'GOM45D', reason: 'Feu rouge grillé', driver: 'Marie', location: 'Centre-ville', date: '10/10/2025', amount: 80000, currency: 'CDF', status: 'En attente' },
    { id: '2', plate: 'BB123C', reason: 'Assurance expirée', driver: 'Richard', location: 'Keshero', date: '07/10/2025', amount: 200000, currency: 'CDF', status: 'Payée' },
    { id: '3', plate: 'KIN89Z', reason: 'Stationnement interdit', driver: 'Jean', location: 'Lycée Wima', date: '05/10/2025', amount: 50000, currency: 'CDF', status: 'En retard' },
];
// --- END MOCK DATA ---

const InfoCard: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
        <div className="flex items-center text-lg font-semibold text-[--text-main] mb-4">
            <Icon className="w-6 h-6 mr-3 text-[--brand-400]" />
            {title}
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem: React.FC<{ label: string; value: string | number | React.ReactNode; isBadge?: boolean }> = ({ label, value, isBadge = false }) => (
    <div className={`flex justify-between items-center ${!isBadge && "border-b border-black/5 pb-2"}`}>
        <p className="text-sm text-[--text-muted]">{label}</p>
        <p className="text-sm font-semibold text-[--text-main]">{value}</p>
    </div>
);

const ValidityStatus: React.FC<{ status: 'Valide' | 'Bientôt expiré' | 'Expiré' }> = ({ status }) => {
    const classes = {
        'Valide': { icon: ShieldCheck, text: 'text-green-600', bg: 'bg-green-100' },
        'Bientôt expiré': { icon: ShieldCheck, text: 'text-yellow-600', bg: 'bg-yellow-100' },
        'Expiré': { icon: ShieldOff, text: 'text-red-600', bg: 'bg-red-100' },
    };
    const { icon: Icon, text, bg } = classes[status];
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center ${text} ${bg}`}>
            <Icon className="w-4 h-4 mr-1.5" />
            {status}
        </span>
    );
};

const FineStatusBadge: React.FC<{ status: Fine['status'] }> = ({ status }) => {
    const classes = {
        'Payée': 'bg-[#1f8a3a] text-white',
        'En retard': 'bg-[#dc2626] text-white',
        'En attente': 'bg-[#f59e0b] text-white',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes[status]}`}>{status}</span>;
};

const VehicleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // In a real app, you would fetch the vehicle data based on the id
    const vehicle = mockVehicles.find(v => v.id === id);
    const vehicleFines = mockFines.filter(f => f.plate === vehicle?.plate);

    if (!vehicle) {
        return <div className="p-8 text-center">Véhicule non trouvé.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/vehicles" className="flex items-center text-sm text-[--brand-600] hover:underline mb-2">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Retour à la liste des voitures
                    </Link>
                    <h1 className="text-2xl font-bold text-[--text-main]">Détails du Véhicule</h1>
                    <p className="text-sm text-[--text-muted]">Plaque: <span className="font-mono">{vehicle.plate}</span></p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Vehicle & Owner Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="text-center bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                        <img src={vehicle.photo} alt={vehicle.owner} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md" />
                        <h2 className="text-xl font-bold text-[--text-main]">{vehicle.owner}</h2>
                        <p className="text-sm text-[--text-muted]">{vehicle.address}</p>
                    </div>

                    <InfoCard title="Informations du Véhicule" icon={Car}>
                        <InfoItem label="Modèle" value={vehicle.makeModel} />
                        <InfoItem label="Année" value={vehicle.year} />
                        <InfoItem label="Couleur" value={vehicle.color} />
                        <InfoItem label="N° Impôt" value={vehicle.taxId} />
                    </InfoCard>
                    
                    <InfoCard title="Statut des Documents" icon={FileText}>
                        <InfoItem label="Documents" value={<ValidityStatus status={vehicle.documentStatus} />} isBadge />
                        <InfoItem label="Assurance" value={<ValidityStatus status={vehicle.insuranceStatus} />} isBadge />
                    </InfoCard>
                </div>

                {/* Right Column: Fines/Infractions */}
                <div className="lg:col-span-2">
                     <InfoCard title="Historique des Amendes" icon={CircleDollarSign}>
                        {vehicleFines.length > 0 ? (
                            <ul className="divide-y divide-black/5">
                                {vehicleFines.map(fine => (
                                    <li key={fine.id} className="py-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-[--text-main]">{fine.reason}</p>
                                                <p className="text-xs text-[--text-muted]">{fine.location} - {fine.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-base text-[--text-main]">{fine.amount.toLocaleString()} {fine.currency}</p>
                                                <FineStatusBadge status={fine.status} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-center text-[--text-muted] py-4">Aucune amende enregistrée pour ce véhicule.</p>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;