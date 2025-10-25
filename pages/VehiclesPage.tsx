import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../types';
import { Search, Plus, ShieldCheck, ShieldOff, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import EditVehicleModal from '../components/Admin/EditVehicleModal';

// MOCK DATA
const initialVehicles: Vehicle[] = [
  { id: '1', photo: 'https://picsum.photos/seed/salomon/200/200', owner: 'Salomon', address: 'Goma', taxId: 'NA', plate: '1234AB', makeModel: 'Nissan Juke', year: 2000, color: 'Rouge', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '2', photo: 'https://picsum.photos/seed/richard/200/200', owner: 'Richard', address: 'Bukavu', taxId: '0922', plate: 'BB123C', makeModel: 'Toyota Rav4', year: 2000, color: 'Verte', documentStatus: 'Expiré', insuranceStatus: 'Valide' },
  { id: '3', photo: 'https://picsum.photos/seed/jean/200/200', owner: 'Jean', address: 'Kinshasa', taxId: '1023', plate: 'KIN89Z', makeModel: 'Honda CRV', year: 2015, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Bientôt expiré' },
  { id: '4', photo: 'https://picsum.photos/seed/marie/200/200', owner: 'Marie', address: 'Goma', taxId: '4589', plate: 'GOM45D', makeModel: 'Mercedes C300', year: 2018, color: 'Blanche', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  { id: '5', photo: 'https://picsum.photos/seed/paul/200/200', owner: 'Paul', address: 'Kinshasa', taxId: '7854', plate: 'KIN22X', makeModel: 'Ford Ranger', year: 2021, color: 'Grise', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const ValidityStatus: React.FC<{ status: 'Valide' | 'Bientôt expiré' | 'Expiré' }> = ({ status }) => {
    const classes = {
        'Valide': { icon: ShieldCheck, text: 'text-green-600', bg: 'bg-green-100' },
        'Bientôt expiré': { icon: ShieldCheck, text: 'text-yellow-600', bg: 'bg-yellow-100' },
        'Expiré': { icon: ShieldOff, text: 'text-red-600', bg: 'bg-red-100' },
    };
    const { icon: Icon, text, bg } = classes[status];
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center ${text} ${bg}`}>
            <Icon className="w-4 h-4 mr-1.5" />
            {status}
        </span>
    );
};


const VehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const filteredVehicles = useMemo(() =>
        vehicles.filter(v =>
            v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.makeModel.toLowerCase().includes(searchTerm.toLowerCase())
        ), [vehicles, searchTerm]);
    
    const handleSave = (updatedVehicle: Vehicle) => {
        setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
        setEditingVehicle(null);
    };

    const handleDelete = (vehicleId: string) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
            setVehicles(prev => prev.filter(v => v.id !== vehicleId));
        }
    };

    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const title = "Rapport des Véhicules";
        const date = new Date().toLocaleDateString('fr-CA');
        doc.text(title, 14, 15);
        doc.text(`Date: ${date}`, 14, 22);

        const head = [['Propriétaire', 'Plaque', 'Modèle', 'Documents', 'Assurance']];
        const body = filteredVehicles.map(v => [
            v.owner,
            v.plate,
            v.makeModel,
            v.documentStatus,
            v.insuranceStatus,
        ]);

        doc.autoTable({
            head: head,
            body: body,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [7, 166, 224] },
        });

        doc.save(`rapport_vehicules_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-main]">Gestion des Véhicules</h1>
                    <p className="text-sm text-[--text-muted]">Consultez, recherchez et gérez les véhicules enregistrés.</p>
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
                                {filteredVehicles.map(vehicle => (
                                    <tr key={vehicle.id} className="border-t border-black/5 hover:bg-brand-50/50">
                                        <td className="p-3">
                                            <Link to={`/vehicles/${vehicle.id}`} className="flex items-center group">
                                                <img src={vehicle.photo} alt={vehicle.owner} className="w-10 h-10 rounded-full object-cover mr-3" />
                                                <div>
                                                    <p className="font-semibold text-[--text-main] group-hover:text-[--brand-600]">{vehicle.owner}</p>
                                                    <p className="text-xs text-[--text-muted]">{vehicle.address}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-3">
                                            <p className="font-mono text-xs text-[--text-main] bg-gray-100 px-2 py-1 rounded-md inline-block">{vehicle.plate}</p>
                                            <p className="text-xs text-[--text-muted] mt-1">{vehicle.makeModel}</p>
                                        </td>
                                        <td className="p-3"><ValidityStatus status={vehicle.documentStatus} /></td>
                                        <td className="p-3"><ValidityStatus status={vehicle.insuranceStatus} /></td>
                                        <td className="p-3">
                                            <ActionMenu onEdit={() => setEditingVehicle(vehicle)} onDelete={() => handleDelete(vehicle.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {editingVehicle && <EditVehicleModal vehicle={editingVehicle} onSave={handleSave} onClose={() => setEditingVehicle(null)} />}
        </>
    );
};

export default VehiclesPage;