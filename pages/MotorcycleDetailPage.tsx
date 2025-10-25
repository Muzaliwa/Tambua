import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Motorcycle, Fine } from '../types';
import { ChevronLeft, Bike, ShieldCheck, ShieldOff, FileText, CircleDollarSign } from 'lucide-react';

// --- MOCK DATA ---
const mockMotorcycles: Motorcycle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/moto1/200/200', owner: 'Kavira Mukeba', address: 'Goma', plate: 'GOM 456 CD', makeModel: 'TVS Star HLX 125', year: 2023, color: 'Rouge', documentStatus: 'Bientôt expiré', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/moto2/200/200', owner: 'Furaha Mutinga', address: 'Goma', plate: 'GOM 789 EF', makeModel: 'Haojue 150', year: 2022, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Expiré' },
  { id: '3', photo: 'https://picsum.photos/seed/moto3/200/200', owner: 'Agent Tambua', address: 'Goma', plate: 'GOM 101 GH', makeModel: 'Boxer BM 150', year: 2024, color: 'Bleue', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '4', photo: 'https://picsum.photos/seed/moto4/200/200', owner: 'Baraka Amos', address: 'Bukavu', plate: 'BUK 112 IJ', makeModel: 'Bajaj', year: 2021, color: 'Grise', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];
const mockFines: Fine[] = [
    { id: '5', plate: 'GOM 456 CD', reason: 'Défaut de casque', driver: 'Kavira Mukeba', location: 'Rond-point Signers', date: '01/10/2025', amount: 25000, currency: 'CDF', status: 'En attente' },
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


const MotorcycleDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const motorcycle = mockMotorcycles.find(m => m.id === id);
    const motorcycleFines = mockFines.filter(f => f.plate === motorcycle?.plate);

    if (!motorcycle) {
        return <div className="p-8 text-center">Moto non trouvée.</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <Link to="/motorcycles" className="flex items-center text-sm text-[--brand-600] hover:underline mb-2">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour à la liste des motos
                </Link>
                <h1 className="text-2xl font-bold text-[--text-main]">Détails de la Moto</h1>
                <p className="text-sm text-[--text-muted]">Plaque: <span className="font-mono">{motorcycle.plate}</span></p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Motorcycle & Owner Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="text-center bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                        <img src={motorcycle.photo} alt={motorcycle.owner} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-md" />
                        <h2 className="text-xl font-bold text-[--text-main]">{motorcycle.owner}</h2>
                        <p className="text-sm text-[--text-muted]">{motorcycle.address}</p>
                    </div>

                    <InfoCard title="Informations de la Moto" icon={Bike}>
                        <InfoItem label="Modèle" value={motorcycle.makeModel} />
                        <InfoItem label="Année" value={motorcycle.year} />
                        <InfoItem label="Couleur" value={motorcycle.color} />
                    </InfoCard>
                    
                    <InfoCard title="Statut des Documents" icon={FileText}>
                        <InfoItem label="Documents" value={<ValidityStatus status={motorcycle.documentStatus} />} isBadge />
                        <InfoItem label="Assurance" value={<ValidityStatus status={motorcycle.insuranceStatus} />} isBadge />
                    </InfoCard>
                </div>

                {/* Right Column: Fines/Infractions */}
                <div className="lg:col-span-2">
                     <InfoCard title="Historique des Amendes" icon={CircleDollarSign}>
                        {motorcycleFines.length > 0 ? (
                            <ul className="divide-y divide-black/5">
                                {motorcycleFines.map(fine => (
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
                            <p className="text-sm text-center text-[--text-muted] py-4">Aucune amende enregistrée pour cette moto.</p>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default MotorcycleDetailPage;