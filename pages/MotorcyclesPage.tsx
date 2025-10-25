import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Motorcycle } from '../types';
import { Search, Plus, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import EditMotorcycleModal from '../components/Admin/EditMotorcycleModal';

// MOCK DATA
const initialMotorcycles: Motorcycle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/moto1/200/200', owner: 'Kavira Mukeba', address: 'Goma', plate: 'GOM 456 CD', makeModel: 'TVS Star HLX 125', year: 2023, color: 'Rouge', documentStatus: 'Bientôt expiré', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/moto2/200/200', owner: 'Furaha Mutinga', address: 'Goma', plate: 'GOM 789 EF', makeModel: 'Haojue 150', year: 2022, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Expiré' },
  { id: '3', photo: 'https://picsum.photos/seed/moto3/200/200', owner: 'Agent Tambua', address: 'Goma', plate: 'GOM 101 GH', makeModel: 'Boxer BM 150', year: 2024, color: 'Bleue', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '4', photo: 'https://picsum.photos/seed/moto4/200/200', owner: 'Baraka Amos', address: 'Bukavu', plate: 'BUK 112 IJ', makeModel: 'Bajaj', year: 2021, color: 'Grise', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const ValidityStatus: React.FC<{ status: 'Valide' | 'Bientôt expiré' | 'Expiré' }> = ({ status }) => {
    const classes = {
        'Valide': 'bg-green-600',
        'Bientôt expiré': 'bg-yellow-500',
        'Expiré': 'bg-red-600',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${classes[status]}`}>
            {status}
        </span>
    );
};


const MotorcyclesPage: React.FC = () => {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(initialMotorcycles);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMotorcycle, setEditingMotorcycle] = useState<Motorcycle | null>(null);

    const filteredMotorcycles = useMemo(() =>
        motorcycles.filter(m =>
            m.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.makeModel.toLowerCase().includes(searchTerm.toLowerCase())
        ), [motorcycles, searchTerm]);
    
    const handleSave = (updatedMotorcycle: Motorcycle) => {
        setMotorcycles(prev => prev.map(m => m.id === updatedMotorcycle.id ? updatedMotorcycle : m));
        setEditingMotorcycle(null);
    };

    const handleDelete = (motorcycleId: string) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer cette moto ?")) {
            setMotorcycles(prev => prev.filter(m => m.id !== motorcycleId));
        }
    };

    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const title = "Rapport des Motos";
        const date = new Date().toLocaleDateString('fr-CA');
        doc.text(title, 14, 15);
        doc.text(`Date: ${date}`, 14, 22);

        const head = [['Propriétaire', 'Plaque', 'Modèle', 'Documents', 'Assurance']];
        const body = filteredMotorcycles.map(m => [
            m.owner,
            m.plate,
            m.makeModel,
            m.documentStatus,
            m.insuranceStatus,
        ]);

        doc.autoTable({
            head: head,
            body: body,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [7, 166, 224] },
        });

        doc.save(`rapport_motos_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-main]">Gestion des Motos</h1>
                    <p className="text-sm text-[--text-muted]">Consultez, recherchez et gérez les motos enregistrées.</p>
                </div>

                <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par plaque, propriétaire..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-black/10 rounded-lg focus:ring-2 focus:ring-[--brand-400]"
                            />
                        </div>
                         <button onClick={exportToPdf} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                            <FileDown className="w-4 h-4 mr-2" />
                            PDF
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-[--text-muted] bg-brand-50/50">
                                <tr>
                                    <th className="p-3 font-semibold">Propriétaire</th>
                                    <th className="p-3 font-semibold">Plaque / Modèle</th>
                                    <th className="p-3 font-semibold">Documents</th>
                                    <th className="p-3 font-semibold">Assurance</th>
                                    <th className="p-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredMotorcycles.map(motorcycle => (
                                    <tr key={motorcycle.id} className="border-t border-black/5 hover:bg-brand-50/50">
                                        <td className="p-3">
                                            <Link to={`/motorcycles/${motorcycle.id}`} className="flex items-center group">
                                                <img src={motorcycle.photo} alt={motorcycle.owner} className="w-10 h-10 rounded-full object-cover mr-3" />
                                                <div>
                                                    <p className="font-semibold text-[--text-main] group-hover:text-[--brand-600]">{motorcycle.owner}</p>
                                                    <p className="text-xs text-[--text-muted]">{motorcycle.address}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-3">
                                            <p className="font-mono text-xs text-[--text-main] bg-gray-100 px-2 py-1 rounded-md inline-block">{motorcycle.plate}</p>
                                            <p className="text-xs text-[--text-muted] mt-1">{motorcycle.makeModel}</p>
                                        </td>
                                        <td className="p-3"><ValidityStatus status={motorcycle.documentStatus} /></td>
                                        <td className="p-3"><ValidityStatus status={motorcycle.insuranceStatus} /></td>
                                        <td className="p-3">
                                            <ActionMenu onEdit={() => setEditingMotorcycle(motorcycle)} onDelete={() => handleDelete(motorcycle.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {editingMotorcycle && <EditMotorcycleModal motorcycle={editingMotorcycle} onSave={handleSave} onClose={() => setEditingMotorcycle(null)} />}
        </>
    );
};

export default MotorcyclesPage;