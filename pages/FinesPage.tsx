import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fine, Vehicle, Motorcycle } from '../types';
import { Search, Filter, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import EditFineModal from '../components/Admin/EditFineModal';

// --- MOCK DATA ---
const mockVehicles: Vehicle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/salomon/150/150', owner: 'Salomon', address: 'Goma', taxId: 'NA', plate: '1234AB', makeModel: 'Nissan Juke', year: 2000, color: 'Rouge', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/richard/150/150', owner: 'Richard', address: 'Bukavu', taxId: '0922', plate: 'BB123C', makeModel: 'Toyota Rav4', year: 2000, color: 'Verte', documentStatus: 'Expiré', insuranceStatus: 'Valide' },
  { id: '3', photo: 'https://picsum.photos/seed/jean/150/150', owner: 'Jean', address: 'Kinshasa', taxId: '1023', plate: 'KIN89Z', makeModel: 'Honda CRV', year: 2015, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Bientôt expiré' },
  { id: '4', photo: 'https://picsum.photos/seed/marie/150/150', owner: 'Marie', address: 'Goma', taxId: '4589', plate: 'GOM45D', makeModel: 'Mercedes C300', year: 2018, color: 'Blanche', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const mockMotorcycles: Motorcycle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/moto1/150/150', owner: 'Kavira Mukeba', address: 'Goma', plate: 'GOM 456 CD', makeModel: 'TVS Star HLX 125', year: 2023, color: 'Rouge', documentStatus: 'Bientôt expiré', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/moto2/150/150', owner: 'Furaha Mutinga', address: 'Goma', plate: 'GOM 789 EF', makeModel: 'Haojue 150', year: 2022, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Expiré' },
  { id: '3', photo: 'https://picsum.photos/seed/moto3/150/150', owner: 'Agent Tambua', address: 'Goma', plate: 'GOM 101 GH', makeModel: 'Boxer BM 150', year: 2024, color: 'Bleue', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const mockFines: Fine[] = [
    { id: '1', plate: 'GOM45D', reason: 'Feu rouge grillé', driver: 'Marie', location: 'Centre-ville', date: '10/10/2025', amount: 80000, currency: 'CDF', status: 'En attente' },
    { id: '2', plate: 'BB123C', reason: 'Assurance expirée', driver: 'Richard', location: 'Keshero', date: '07/10/2025', amount: 200000, currency: 'CDF', status: 'Payée' },
    { id: '3', plate: 'KIN89Z', reason: 'Stationnement interdit', driver: 'Jean', location: 'Lycée Wima', date: '05/10/2025', amount: 50000, currency: 'CDF', status: 'En retard' },
    { id: '4', plate: '1234AB', reason: 'Excès de vitesse', driver: 'Salomon', location: 'Aéroport', date: '02/10/2025', amount: 120000, currency: 'CDF', status: 'Payée' },
    { id: '5', plate: 'GOM 456 CD', reason: 'Défaut de casque', driver: 'Kavira Mukeba', location: 'Rond-point Signers', date: '01/10/2025', amount: 25000, currency: 'CDF', status: 'En attente' },
];
// --- END MOCK DATA ---

// Add declaration for jsPDF
declare global {
  interface Window {
    jspdf: any;
  }
}

const StatusBadge: React.FC<{ status: Fine['status'] }> = ({ status }) => {
    const statusClasses = {
        'Payée': 'bg-green-100 text-green-800',
        'En retard': 'bg-red-100 text-red-800',
        'En attente': 'bg-yellow-100 text-yellow-800',
    };
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

type EnrichedFine = Fine & {
    ownerPhoto: string;
    vehicleId?: string;
    motorcycleId?: string;
};

const FinesPage: React.FC = () => {
    const navigate = useNavigate();
    const [fines, setFines] = useState<Fine[]>(mockFines);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [editingFine, setEditingFine] = useState<Fine | null>(null);

    const enrichedFines = useMemo(() => {
        return fines.map(fine => {
            const vehicle = mockVehicles.find(v => v.plate === fine.plate);
            const motorcycle = mockMotorcycles.find(m => m.plate === fine.plate);
            const ownerInfo = vehicle || motorcycle;
            return {
                ...fine,
                ownerPhoto: ownerInfo?.photo || 'https://picsum.photos/seed/placeholder/150/150',
                vehicleId: vehicle?.id,
                motorcycleId: motorcycle?.id,
            };
        });
    }, [fines]);

    const filteredFines = useMemo(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return enrichedFines.filter(fine => {
            const matchesSearch =
                fine.plate.toLowerCase().includes(lowerCaseQuery) ||
                fine.driver.toLowerCase().includes(lowerCaseQuery) ||
                fine.reason.toLowerCase().includes(lowerCaseQuery);

            const matchesStatus =
                statusFilter === 'Tous' || fine.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, enrichedFines]);
    
    const handleDelete = (id: string) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer cette amende ?")) {
            setFines(prev => prev.filter(f => f.id !== id));
        }
    };
    
    const handleSave = (updatedFine: Fine) => {
        setFines(prev => prev.map(f => f.id === updatedFine.id ? updatedFine : f));
        setEditingFine(null);
    };

    const handleRowClick = (fine: EnrichedFine) => {
        if (fine.vehicleId) {
            navigate(`/vehicles/${fine.vehicleId}`);
        } else if (fine.motorcycleId) {
            navigate(`/motorcycles/${fine.motorcycleId}`);
        } else {
            console.warn(`Aucun dossier trouvé pour la plaque : ${fine.plate}`);
        }
    };
    
    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const title = "Rapport des Amendes";
        const date = new Date().toLocaleDateString('fr-FR');
        doc.text(`${title} - ${date}`, 14, 15);

        const tableColumn = ['Propriétaire', 'Plaque', 'Motif', 'Montant', 'Statut Amende'];
        const tableRows: (string|number)[][] = [];

        filteredFines.forEach(fine => {
            const fineData = [
                fine.driver,
                fine.plate,
                fine.reason,
                `${fine.amount.toLocaleString()} ${fine.currency}`,
                fine.status,
            ];
            tableRows.push(fineData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
        });
        
        doc.save(`rapport_amendes_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Gestion des Amendes</h1>
                        <p className="text-sm text-gray-500">Liste de toutes les amendes enregistrées.</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher (plaque, conducteur...)"
                                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="Tous">Tous les statuts</option>
                                <option value="Payée">Payée</option>
                                <option value="En attente">En attente</option>
                                <option value="En retard">En retard</option>
                            </select>
                             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button onClick={exportToPdf} className="flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
                            <FileDown className="w-5 h-5 mr-2" />
                            PDF
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Propriétaire', 'Plaque', 'Motif', 'Montant', 'Statut Amende', 'Actions'].map(header => (
                                    <th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredFines.map((fine) => (
                                <tr key={fine.id} onClick={() => handleRowClick(fine)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={fine.ownerPhoto} alt={fine.driver} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{fine.driver}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{fine.plate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fine.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{fine.amount.toLocaleString()} {fine.currency}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={fine.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ActionMenu
                                            onEdit={() => setEditingFine(fine)}
                                            onDelete={() => handleDelete(fine.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingFine && (
                <EditFineModal
                    fine={editingFine}
                    onClose={() => setEditingFine(null)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default FinesPage;
