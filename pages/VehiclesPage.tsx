import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../types';
import { Search, Filter, PlusCircle, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import EditVehicleModal from '../components/Admin/EditVehicleModal';

// --- MOCK DATA ---
const mockVehicles: Vehicle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/salomon/150/150', owner: 'Salomon', address: 'Goma', taxId: 'NA', plate: '1234AB', makeModel: 'Nissan Juke', year: 2000, color: 'Rouge', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/richard/150/150', owner: 'Richard', address: 'Bukavu', taxId: '0922', plate: 'BB123C', makeModel: 'Toyota Rav4', year: 2000, color: 'Verte', documentStatus: 'Expiré', insuranceStatus: 'Valide' },
  { id: '3', photo: 'https://picsum.photos/seed/jean/150/150', owner: 'Jean', address: 'Kinshasa', taxId: '1023', plate: 'KIN89Z', makeModel: 'Honda CRV', year: 2015, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Bientôt expiré' },
  { id: '4', photo: 'https://picsum.photos/seed/marie/150/150', owner: 'Marie', address: 'Goma', taxId: '4589', plate: 'GOM45D', makeModel: 'Mercedes C300', year: 2018, color: 'Blanche', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '5', photo: 'https://picsum.photos/seed/paul/150/150', owner: 'Paul', address: 'Kinshasa', taxId: '7854', plate: 'KIN22X', makeModel: 'Ford Ranger', year: 2021, color: 'Grise', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];
// --- END MOCK DATA ---

// Add declaration for jsPDF
declare global {
  interface Window {
    jspdf: any;
  }
}

const ValidityBadge: React.FC<{ status: Vehicle['documentStatus'] }> = ({ status }) => {
    const statusClasses = {
        'Valide': 'bg-green-100 text-green-800',
        'Bientôt expiré': 'bg-yellow-100 text-yellow-800',
        'Expiré': 'bg-red-100 text-red-800',
    };
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const VehiclesPage: React.FC = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(vehicle => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const matchesSearch =
                vehicle.plate.toLowerCase().includes(lowerCaseQuery) ||
                vehicle.owner.toLowerCase().includes(lowerCaseQuery) ||
                vehicle.makeModel.toLowerCase().includes(lowerCaseQuery);

            const matchesStatus =
                statusFilter === 'Tous' ||
                vehicle.documentStatus === statusFilter ||
                vehicle.insuranceStatus === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, vehicles]);
    
    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
            setVehicles(prev => prev.filter(v => v.id !== id));
        }
    };

    const handleSave = (updatedVehicle: Vehicle) => {
        setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
        setEditingVehicle(null);
    };

    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const title = "Rapport des Véhicules";
        const date = new Date().toLocaleDateString('fr-FR');
        doc.text(`${title} - ${date}`, 14, 15);

        const tableColumn = ['Propriétaire', 'Plaque', 'Modèle', 'Statut Documents', 'Statut Assurance'];
        const tableRows: (string|number)[][] = [];

        filteredVehicles.forEach(vehicle => {
            const vehicleData = [
                vehicle.owner,
                vehicle.plate,
                vehicle.makeModel,
                vehicle.documentStatus,
                vehicle.insuranceStatus,
            ];
            tableRows.push(vehicleData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
        });
        
        doc.save(`rapport_vehicules_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Gestion des Voitures</h1>
                        <p className="text-sm text-gray-500">Liste de toutes les voitures enregistrées.</p>
                    </div>
                     <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher (plaque, propriétaire...)"
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
                                <option value="Valide">Valide</option>
                                <option value="Bientôt expiré">Bientôt expiré</option>
                                <option value="Expiré">Expiré</option>
                            </select>
                             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button onClick={exportToPdf} className="flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
                            <FileDown className="w-5 h-5 mr-2" />
                            PDF
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Ajouter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Propriétaire', 'Plaque', 'Modèle', 'Statut Documents', 'Statut Assurance', 'Actions'].map(header => (
                                    <th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVehicles.map((vehicle) => (
                                <tr key={vehicle.id} onClick={() => navigate(`/vehicles/${vehicle.id}`)} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={vehicle.photo} alt={vehicle.owner} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{vehicle.owner}</div>
                                                <div className="text-sm text-gray-500">{vehicle.address}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{vehicle.plate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{vehicle.makeModel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><ValidityBadge status={vehicle.documentStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><ValidityBadge status={vehicle.insuranceStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ActionMenu
                                            onEdit={() => setEditingVehicle(vehicle)}
                                            onDelete={() => handleDelete(vehicle.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingVehicle && (
                <EditVehicleModal
                    vehicle={editingVehicle}
                    onClose={() => setEditingVehicle(null)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default VehiclesPage;
