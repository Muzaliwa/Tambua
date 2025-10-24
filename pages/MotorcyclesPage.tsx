import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Motorcycle } from '../types';
import { Search, Filter, PlusCircle, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import EditMotorcycleModal from '../components/Admin/EditMotorcycleModal';


// --- MOCK DATA ---
const mockMotorcycles: Motorcycle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/moto1/150/150', owner: 'Kavira Mukeba', address: 'Goma', plate: 'GOM 456 CD', makeModel: 'TVS Star HLX 125', year: 2023, color: 'Rouge', documentStatus: 'Bientôt expiré', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/moto2/150/150', owner: 'Furaha Mutinga', address: 'Goma', plate: 'GOM 789 EF', makeModel: 'Haojue 150', year: 2022, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Expiré' },
  { id: '3', photo: 'https://picsum.photos/seed/moto3/150/150', owner: 'Agent Tambua', address: 'Goma', plate: 'GOM 101 GH', makeModel: 'Boxer BM 150', year: 2024, color: 'Bleue', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '4', photo: 'https://picsum.photos/seed/moto4/150/150', owner: 'Baraka Amos', address: 'Bukavu', plate: 'BUK 112 IJ', makeModel: 'Bajaj', year: 2021, color: 'Grise', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];
// --- END MOCK DATA ---

// Add declaration for jsPDF
declare global {
  interface Window {
    jspdf: any;
  }
}

const ValidityBadge: React.FC<{ status: Motorcycle['documentStatus'] }> = ({ status }) => {
    const statusClasses = {
        'Valide': 'bg-[#1f8a3a] text-white',
        'Bientôt expiré': 'bg-[#f59e0b] text-white',
        'Expiré': 'bg-[#dc2626] text-white',
    };
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const MotorcyclesPage: React.FC = () => {
    const navigate = useNavigate();
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(mockMotorcycles);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null);

    const filteredMotorcycles = useMemo(() => {
        return motorcycles.filter(motorcycle => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const matchesSearch =
                motorcycle.plate.toLowerCase().includes(lowerCaseQuery) ||
                motorcycle.owner.toLowerCase().includes(lowerCaseQuery) ||
                motorcycle.makeModel.toLowerCase().includes(lowerCaseQuery);

            const matchesStatus =
                statusFilter === 'Tous' ||
                motorcycle.documentStatus === statusFilter ||
                motorcycle.insuranceStatus === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, motorcycles]);
    
    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette moto ?')) {
            setMotorcycles(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleSave = (updatedMotorcycle: Motorcycle) => {
        setMotorcycles(prev => prev.map(m => m.id === updatedMotorcycle.id ? updatedMotorcycle : m));
        setEditingMotorcycle(null);
    };

    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const title = "Rapport des Motos";
        const date = new Date().toLocaleDateString('fr-FR');
        doc.text(`${title} - ${date}`, 14, 15);

        const tableColumn = ['Propriétaire', 'Plaque', 'Modèle', 'Statut Documents', 'Statut Assurance'];
        const tableRows: (string|number)[][] = [];

        filteredMotorcycles.forEach(moto => {
            const motoData = [
                moto.owner,
                moto.plate,
                moto.makeModel,
                moto.documentStatus,
                moto.insuranceStatus,
            ];
            tableRows.push(motoData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: 'grid',
        });
        
        doc.save(`rapport_motos_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6 border-b border-black/5 pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-[--text-main]">Gestion des Motos</h1>
                        <p className="text-sm text-[--text-muted]">Liste de toutes les motos enregistrées.</p>
                    </div>
                     <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher (plaque, propriétaire...)"
                                className="pl-10 pr-4 py-2 bg-white border border-black/10 rounded-lg focus:ring-[--brand-400] focus:border-[--brand-400] text-[--text-main] placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2 bg-white border border-black/10 rounded-lg focus:ring-[--brand-400] focus:border-[--brand-400] text-[--text-main] text-sm"
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
                        <button onClick={exportToPdf} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg rounded-lg transition-shadow">
                            <FileDown className="w-5 h-5 mr-2" />
                            PDF
                        </button>
                        <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Ajouter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-black/5">
                        <thead className="bg-brand-50/50">
                            <tr>
                                {['Propriétaire', 'Plaque', 'Modèle', 'Statut Documents', 'Statut Assurance', 'Actions'].map(header => (
                                    <th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-[--text-muted] uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-black/5">
                            {filteredMotorcycles.map((motorcycle) => (
                                <tr 
                                    key={motorcycle.id} 
                                    onClick={() => navigate(`/motorcycles/${motorcycle.id}`)} 
                                    className="hover:bg-brand-50/50 cursor-pointer rounded-lg transition-all"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && navigate(`/motorcycles/${motorcycle.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={motorcycle.photo} alt={motorcycle.owner} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[--text-main]">{motorcycle.owner}</div>
                                                <div className="text-sm text-[--text-muted]">{motorcycle.address}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-[--text-muted]">{motorcycle.plate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[--text-main]">{motorcycle.makeModel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><ValidityBadge status={motorcycle.documentStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><ValidityBadge status={motorcycle.insuranceStatus} /></td>
                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ActionMenu
                                            onEdit={() => setEditingMotorcycle(motorcycle)}
                                            onDelete={() => handleDelete(motorcycle.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingMotorcycle && (
                <EditMotorcycleModal
                    motorcycle={editingMotorcycle}
                    onClose={() => setEditingMotorcycle(null)}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default MotorcyclesPage;