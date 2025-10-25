import React, { useState } from 'react';
import { Infraction } from '../types';
import { Plus, AlertTriangle } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import AddInfractionModal from '../components/Admin/AddInfractionModal';
import EditInfractionModal from '../components/Admin/EditInfractionModal';

// Mock Data
const initialInfractions: Infraction[] = [
    { id: '1', code: 'RDC-SEC-001', label: 'Excès de vitesse', description: 'Dépassement de la vitesse autorisée en agglomération.', severity: 'GRAVE', amount: 120000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', code: 'RDC-STA-003', label: 'Stationnement interdit', description: 'Véhicule garé sur une zone non autorisée.', severity: 'LEGER', amount: 50000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', code: 'RDC-ASS-010', label: 'Défaut d\'assurance', description: 'Circulation sans une assurance valide.', severity: 'TRES_GRAVE', amount: 200000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', code: 'RDC-EQU-005', label: 'Défaut de casque', description: 'Conduite de moto sans port du casque.', severity: 'MOYEN', amount: 25000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const SeverityBadge: React.FC<{ severity: Infraction['severity'] }> = ({ severity }) => {
    const classes = {
        'LEGER': 'bg-blue-500 text-white',
        'MOYEN': 'bg-yellow-500 text-white',
        'GRAVE': 'bg-orange-500 text-white',
        'TRES_GRAVE': 'bg-red-600 text-white',
    };
    const labels = {'LEGER': 'Léger', 'MOYEN': 'Moyen', 'GRAVE': 'Grave', 'TRES_GRAVE': 'Très Grave' };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes[severity]}`}>{labels[severity]}</span>;
};

const InfractionsPage: React.FC = () => {
    const [infractions, setInfractions] = useState<Infraction[]>(initialInfractions);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingInfraction, setEditingInfraction] = useState<Infraction | null>(null);

    const handleAdd = (newInfractionData: Omit<Infraction, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newInfraction: Infraction = {
            ...newInfractionData,
            id: String(Date.now()),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setInfractions(prev => [newInfraction, ...prev]);
    };

    const handleSave = (updatedInfraction: Infraction) => {
        setInfractions(prev => prev.map(i => i.id === updatedInfraction.id ? { ...updatedInfraction, updatedAt: new Date().toISOString() } : i));
        setEditingInfraction(null);
    };

    const handleDelete = (infractionId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette infraction ?")) {
            setInfractions(prev => prev.filter(i => i.id !== infractionId));
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-main]">Catalogue des Infractions</h1>
                    <p className="text-sm text-[--text-muted]">Gérez les types d'infractions et les montants des amendes.</p>
                </div>

                <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                            <Plus className="w-5 h-5 mr-2" />
                            Ajouter une Infraction
                        </button>
                    </div>

                     <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-[--text-muted] bg-brand-50/50">
                                <tr>
                                    <th className="p-3 font-semibold">Code</th>
                                    <th className="p-3 font-semibold">Label</th>
                                    <th className="p-3 font-semibold">Sévérité</th>
                                    <th className="p-3 font-semibold">Montant (CDF)</th>
                                    <th className="p-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {infractions.map(infraction => (
                                    <tr key={infraction.id} className="border-t border-black/5 hover:bg-brand-50/50">
                                        <td className="p-3 font-mono text-xs text-[--text-main]">{infraction.code}</td>
                                        <td className="p-3 font-semibold text-[--text-main]">{infraction.label}</td>
                                        <td className="p-3"><SeverityBadge severity={infraction.severity} /></td>
                                        <td className="p-3 font-semibold text-[--text-main]">{infraction.amount.toLocaleString()}</td>
                                        <td className="p-3">
                                            <ActionMenu
                                                onEdit={() => setEditingInfraction(infraction)}
                                                onDelete={() => handleDelete(infraction.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {infractions.length === 0 && (
                        <div className="text-center py-12 text-[--text-muted]">
                            <AlertTriangle className="mx-auto w-12 h-12 mb-2" />
                            <p>Aucune infraction définie.</p>
                        </div>
                    )}
                </div>
            </div>
            {isAddModalOpen && <AddInfractionModal onAdd={handleAdd} onClose={() => setIsAddModalOpen(false)} />}
            {editingInfraction && <EditInfractionModal infraction={editingInfraction} onSave={handleSave} onClose={() => setEditingInfraction(null)} />}
        </>
    );
};

export default InfractionsPage;