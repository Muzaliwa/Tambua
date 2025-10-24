import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../types';
import { Search, PlusCircle, MoreVertical, Trash2, Eye } from 'lucide-react';
import AddAgentModal from '../components/Admin/AddAgentModal';

const mockAgentsData: Agent[] = [
  { id: 'agent-1', name: 'Agent Tambua', email: 'agent@tambua.com', avatar: 'AT', registrationsToday: 5, finesCollectedToday: 120000, status: 'Actif' },
  { id: 'agent-2', name: 'John Doe', email: 'john.doe@tambua.com', avatar: 'JD', registrationsToday: 2, finesCollectedToday: 55000, status: 'Actif' },
  { id: 'agent-3', name: 'Jane Smith', email: 'jane.smith@tambua.com', avatar: 'JS', registrationsToday: 0, finesCollectedToday: 0, status: 'Inactif' },
];

const StatusBadge: React.FC<{ status: Agent['status'] }> = ({ status }) => {
    const statusClasses = {
        'Actif': 'bg-green-100 text-green-800',
        'Inactif': 'bg-gray-100 text-gray-800',
    };
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>(mockAgentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredAgents = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) return agents;
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(lowerCaseQuery) ||
      agent.email.toLowerCase().includes(lowerCaseQuery)
    );
  }, [searchQuery, agents]);
  
  const handleAddAgent = (newAgentData: Omit<Agent, 'id' | 'avatar' | 'registrationsToday' | 'finesCollectedToday' | 'status'>) => {
    const avatar = `${newAgentData.name.charAt(0)}${newAgentData.name.split(' ')[1]?.charAt(0) || ''}`.toUpperCase();
    const newAgent: Agent = {
      ...newAgentData,
      id: `agent-${Math.random().toString(36).substring(2, 9)}`,
      avatar,
      registrationsToday: 0,
      finesCollectedToday: 0,
      status: 'Actif',
    };
    setAgents(prev => [newAgent, ...prev]);
  };

  const handleDeleteAgent = (agentId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
    }
    setActiveDropdown(null);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Gestion des Agents</h1>
            <p className="text-sm text-gray-500">Liste des agents et leurs activités.</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher par nom ou email..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <PlusCircle className="w-5 h-5 mr-2" />
                Ajouter un agent
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Agent', 'Email', "Activité d'aujourd'hui", 'Statut', 'Actions'].map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/agents/${agent.id}`)}>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                            {agent.avatar}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{agent.registrationsToday} enregistrements</div>
                    <div className="font-semibold">{agent.finesCollectedToday.toLocaleString()} FC perçus</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={agent.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                        onClick={() => setActiveDropdown(activeDropdown === agent.id ? null : agent.id)}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full group-hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdown === agent.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                            <a href={`#/agents/${agent.id}`} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Eye className="w-4 h-4 mr-2" /> Voir le rapport
                            </a>
                            <button onClick={() => handleDeleteAgent(agent.id)} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <AddAgentModal onClose={() => setIsModalOpen(false)} onAdd={handleAddAgent} />}
    </>
  );
};

export default AgentsPage;
