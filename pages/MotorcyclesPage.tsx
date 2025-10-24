import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Motorcycle } from '../types';
import { Search, MoreVertical } from 'lucide-react';

const mockMotorcycles: Motorcycle[] = [
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '1', photo: 'https://picsum.photos/seed/moto1/150/150', owner: 'Kavira Mukeba', address: 'Goma', plate: 'GOM 456 CD', makeModel: 'TVS Star HLX 125', year: 2023, color: 'Rouge', documentStatus: 'Bientôt expiré', insuranceStatus: 'Valide' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '2', photo: 'https://picsum.photos/seed/moto2/150/150', owner: 'Furaha Mutinga', address: 'Goma', plate: 'GOM 789 EF', makeModel: 'Haojue 150', year: 2022, color: 'Noire', documentStatus: 'Valide', insuranceStatus: 'Expiré' },
  // FIX: Added missing properties 'documentStatus' and 'insuranceStatus'
  { id: '3', photo: 'https://picsum.photos/seed/moto3/150/150', owner: 'Agent Tambua', address: 'Goma', plate: 'GOM 101 GH', makeModel: 'Boxer BM 150', year: 2024, color: 'Bleue', documentStatus: 'Valide', insuranceStatus: 'Valide' },
];

const MotorcyclesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMotorcycles = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) {
      return mockMotorcycles;
    }
    return mockMotorcycles.filter(motorcycle =>
      motorcycle.owner.toLowerCase().includes(lowerCaseQuery) ||
      motorcycle.plate.toLowerCase().includes(lowerCaseQuery) ||
      motorcycle.makeModel.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tambua - Motos</h1>
          <p className="text-sm text-gray-500">Liste des motos enregistrées.</p>
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
              {['Photo', 'Propriétaire', 'Adresse', 'Plaque', 'Marque / Modèle', 'Année', 'Couleur', 'Actions'].map(header => (
                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMotorcycles.map((motorcycle) => (
              <tr key={motorcycle.id} onClick={() => navigate(`/motorcycles/${motorcycle.id}`)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img className="h-10 w-10 rounded-full" src={motorcycle.photo} alt={motorcycle.owner} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{motorcycle.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{motorcycle.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{motorcycle.plate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{motorcycle.makeModel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{motorcycle.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{motorcycle.color}</td>
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

export default MotorcyclesPage;