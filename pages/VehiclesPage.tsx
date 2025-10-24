import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vehicle } from '../types';
import { Search, MoreVertical } from 'lucide-react';

const mockVehicles: Vehicle[] = [
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '1', photo: 'https://picsum.photos/seed/salomon/150/150', owner: 'Salomon', address: 'Goma', taxId: 'NA', plate: '1234AB', makeModel: 'Nissan Juke', year: 2000, color: 'Rouge', documentStatus: 'Valide', insuranceStatus: 'Valide' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '2', photo: 'https://picsum.photos/seed/richard/150/150', owner: 'Richard', address: 'Bukavu', taxId: '0922', plate: 'BB123C', makeModel: 'Toyota Rav4', year: 2000, color: 'Verte', documentStatus: 'Expiré', insuranceStatus: 'Valide' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '3', photo: 'https://picsum.photos/seed/jean/150/150', owner: 'Jean', address: 'Kinshasa', taxId: '1023', plate: 'KIN89Z', makeModel: 'Honda CRV', year: 2015, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Bientôt expiré' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '4', photo: 'https://picsum.photos/seed/marie/150/150', owner: 'Marie', address: 'Goma', taxId: '4589', plate: 'GOM45D', makeModel: 'Mercedes C300', year: 2018, color: 'Blanche', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) {
      return mockVehicles;
    }
    return mockVehicles.filter(vehicle =>
      vehicle.owner.toLowerCase().includes(lowerCaseQuery) ||
      vehicle.plate.toLowerCase().includes(lowerCaseQuery) ||
      vehicle.makeModel.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tambua - Voitures</h1>
          <p className="text-sm text-gray-500">Liste des voitures enregistrées.</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher (propriétaire, plaque...)" 
              className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Photo', 'Nom / Raison', 'Adresse', 'N° Impôt', 'Plaque', 'Marque / Modèle', 'Année', 'Couleur', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} onClick={() => navigate(`/vehicles/${vehicle.id}`)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img className="h-10 w-10 rounded-full" src={vehicle.photo} alt={vehicle.owner} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.taxId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{vehicle.plate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.makeModel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.color}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesPage;