import React, { useState, useMemo } from 'react';
import { Fine } from '../types';
import { Search, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import EditFineModal from '../components/Admin/EditFineModal';

// MOCK DATA
const initialFines: Fine[] = [
    { id: '1', plate: 'GOM45D', reason: 'Feu rouge grillé', driver: 'Marie', location: 'Centre-ville', date: '2025-10-10', amount: 80000, currency: 'CDF', status: 'En attente' },
    { id: '2', plate: 'BB123C', reason: 'Assurance expirée', driver: 'Richard', location: 'Keshero', date: '2025-10-07', amount: 200000, currency: 'CDF', status: 'Payée' },
    { id: '3', plate: 'KIN89Z', reason: 'Stationnement interdit', driver: 'Jean', location: 'Lycée Wima', date: '2025-10-05', amount: 50000, currency: 'CDF', status: 'En retard' },
    { id: '4', plate: '1234AB', reason: 'Excès de vitesse', driver: 'Salomon', location: 'Aéroport', date: '2025-10-02', amount: 120000, currency: 'CDF', status: 'Payée' },
    { id: '5', plate: 'GOM 456 CD', reason: 'Défaut de casque', driver: 'Kavira Mukeba', location: 'Rond-point Signers', date: '2025-10-01', amount: 25000, currency: 'CDF', status: 'En attente' },
];

const FineStatusBadge: React.FC<{ status: Fine['status'] }> = ({ status }) => {
    const classes = {
        'Payée': 'bg-[#1f8a3a] text-white',
        'En retard': 'bg-[#dc2626] text-white',
        'En attente': 'bg-[#f59e0b] text-white',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes[status]}`}>{status}</span>;
};

const FinesPage: React.FC = () => {
    const [fines, setFines] = useState<Fine[]>(initialFines);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingFine, setEditingFine] = useState<Fine | null>(null);

    const filteredFines = useMemo(() =>
        fines.filter(f =>
            (f.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
             f.driver.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (statusFilter === 'all' || f.status === statusFilter)
        ), [fines, searchTerm, statusFilter]);

    const handleSave = (updatedFine: Fine) => {
        setFines(prev => prev.map(f => f.id === updatedFine.id ? updatedFine : f));
        setEditingFine(null);
    };

    const handleDelete = (fineId: string) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer cette amende ?")) {
            setFines(prev => prev.filter(f => f.id !== fineId));
        }
    };

    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        const title = "Rapport des Amendes";
        const date = new Date().toLocaleDateString('fr-CA');
        doc.text(title, 14, 15);
        doc.text(`Date: ${date}`, 14, 22);
    
        const head = [['Plaque', 'Conducteur', 'Motif', 'Montant', 'Date', 'Statut']];
        const body = filteredFines.map(f => [
            f.plate,
            f.driver,
            f.reason,
            `${f.amount.toLocaleString()} ${f.currency}`,
            new Date(f.date).toLocaleDateString(),
            f.status,
        ]);
    
        doc.autoTable({
            head: head,
            body: body,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [7, 166, 224] },
        });
    
        doc.save(`rapport_amendes_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-main]">Gestion des Amendes</h1>
                    <p className="text-sm text-[--text-muted]">Suivez et gérez toutes les amendes enregistrées.</p>
                </div>
                 <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                    <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                        <div className="relative w-full max-w-sm">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par plaque, conducteur..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-black/10 rounded-lg focus:ring-2 focus:ring-[--brand-400]"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                             <div className="flex items-center space-x-2">
                                <label htmlFor="statusFilter" className="text-sm font-medium text-[--text-muted]">Statut:</label>
                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 text-sm bg-white border border-black/10 rounded-lg focus:ring-2 focus:ring-[--brand-400]"
                                >
                                    <option value="all">Tous</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Payée">Payée</option>
                                    <option value="En retard">En retard</option>
                                </select>
                             </div>
                             <button onClick={exportToPdf} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                                <FileDown className="w-4 h-4 mr-2" />
                                PDF
                            </button>
                        </div>
                    </div>

                     <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-[--text-muted] bg-brand-50/50">
                                <tr>
                                    <th className="p-3 font-semibold">Plaque</th>
                                    <th className="p-3 font-semibold">Conducteur</th>
                                    <th className="p-3 font-semibold">Motif</th>
                                    <th className="p-3 font-semibold">Montant (CDF)</th>
                                    <th className="p-3 font-semibold">Date</th>
                                    <th className="p-3 font-semibold">Statut</th>
                                    <th className="p-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredFines.map(fine => (
                                    <tr key={fine.id} className="border-t border-black/5 hover:bg-brand-50/50">
                                        <td className="p-3 font-mono text-xs text-[--text-main]">{fine.plate}</td>
                                        <td className="p-3 font-semibold text-[--text-main]">{fine.driver}</td>
                                        <td className="p-3 text-[--text-muted]">{fine.reason}</td>
                                        <td className="p-3 font-semibold text-[--text-main]">{fine.amount.toLocaleString()}</td>
                                        <td className="p-3 text-[--text-muted]">{new Date(fine.date).toLocaleDateString()}</td>
                                        <td className="p-3"><FineStatusBadge status={fine.status} /></td>
                                        <td className="p-3">
                                            <ActionMenu onEdit={() => setEditingFine(fine)} onDelete={() => handleDelete(fine.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {editingFine && <EditFineModal fine={editingFine} onSave={handleSave} onClose={() => setEditingFine(null)} />}
        </>
    );
};

export default FinesPage;