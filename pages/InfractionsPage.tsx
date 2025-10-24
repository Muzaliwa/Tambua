import React, { useState, useMemo } from 'react';
import { Infraction } from '../types';
import { Search, PlusCircle, MoreVertical } from 'lucide-react';
import AddInfractionModal from '../components/Admin/AddInfractionModal';

const mockInfractions: Infraction[] = [
  { id: '3f7d2b8a', code: 'RDC-ENV-021', label: 'Pollution sonore', description: 'Nuisances sonores excessives dépassant les limites autorisées.', severity: 'MOYEN', amount: 75000, createdAt: '2025-10-20T09:02:50.531Z', updatedAt: '2025-10-20T09:02:50.531Z' },
  { id: 'a1b2c3d4', code: 'RDC-PARK-001', label: 'Stationnement interdit', description: 'Stationnement sur une ligne rouge ou dans une zone non autorisée.', severity: 'LEGER', amount: 40000, createdAt: '2025-09-15T11:30:00.000Z', updatedAt: '2025-09-15T11:30:00.000Z' },
  { id: 'e8f45c45', code: 'RDC-SEC-099', label: 'Excès de vitesse', description: 'Dépassement de la limite de vitesse autorisée en zone urbaine.', severity: 'GRAVE', amount: 120000, createdAt: '2025-10-20T09:02:50.531Z', updatedAt: '2025-10-20T09:02:50.531Z' },
  { id: 'b5e6f7a8', code: 'RDC-DOC-005', label: 'Défaut d\'assurance', description: 'Circulation sans une assurance valide pour le véhicule.', severity: 'TRES_GRAVE', amount: 200000, createdAt: '2025-08-01T14:00:00.000Z', updatedAt: '2025-08-01T14:00:00.000Z' },
  { id: 'c9d8e7f6', code: 'RDC-EQ-012', label: 'Défaut de casque', description: 'Conducteur de moto ou passager sans casque de protection.', severity: 'LEGER', amount: 25000, createdAt: '2025-07-22T08:45:00.000Z', updatedAt: '2025-07-22T08:45:00.000Z' },
];

const SeverityBadge: React.FC<{ severity: Infraction['severity'] }> = ({ severity }) => {
    const severityClasses = {
        'LEGER': 'bg-blue-100 text-blue-800',
        'MOYEN': 'bg-yellow-100 text-yellow-800',
        'GRAVE': 'bg-orange-100 text-orange-800',
        'TRES_GRAVE': 'bg-red-100 text-red-800',
    };
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    return <span className={`${baseClasses} ${severityClasses[severity]}`}>{severity.replace('_', ' ')}</span>;
};


const InfractionsPage: React.FC = () => {
  const [infractions, setInfractions] = useState<Infraction[]>(mockInfractions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredInfractions = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) {
      return infractions;
    }
    return infractions.filter(infraction =>
      infraction.label.toLowerCase().includes(lowerCaseQuery) ||
      infraction.code.toLowerCase().includes(lowerCaseQuery) ||
      infraction.description.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, infractions]);

  const handleAddInfraction = (newInfractionData: Omit<Infraction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInfraction: Infraction = {
        ...newInfractionData,
        id: Math.random().toString(36).substring(2, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setInfractions(prev => [newInfraction, ...prev]);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Gestion des Infractions</h1>
            <p className="text-sm text-gray-500">Liste des infractions et leurs barèmes.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher (label, code...)" 
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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
                {['Code', 'Label', 'Sévérité', 'Montant', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInfractions.map((infraction) => (
                <tr key={infraction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{infraction.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{infraction.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><SeverityBadge severity={infraction.severity} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{infraction.amount.toLocaleString()} CDF</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <AddInfractionModal onClose={() => setIsModalOpen(false)} onAdd={handleAddInfraction} />}
    </>
  );
};

export default InfractionsPage;
