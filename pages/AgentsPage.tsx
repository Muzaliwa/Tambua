import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../types';
import { Search, Filter, PlusCircle } from 'lucide-react';
import AddAgentModal from '../components/Admin/AddAgentModal';
import ActionMenu from '../components/Admin/ActionMenu';

// --- MOCK DATA ---
const mockAgents: Agent[] = [
  { id: 'agent-1', name: 'Agent Tambua', email: 'agent@tambua.com', avatar: 'AT', status: 'Actif', registrationsToday: 5, finesCollectedToday: 120000 },
  { id: 'agent-2', name: 'John Doe', email: 'john.doe@tambua.com', avatar: 'JD', status: 'Actif', registrationsToday: 3, finesCollectedToday: 85000 },
  { id: 'agent-3', name: 'Jane Smith', email: 'jane.smith@tambua.com', avatar: 'JS', status: 'Inactif', registrationsToday: 0, finesCollectedToday: 0 },
  { id: 'agent-4', name: 'Pierre Simon', email: 'pierre.simon@tambua.com', avatar: 'PS', status: 'Actif', registrationsToday: 8, finesCollectedToday: 250000 },
];
// --- END MOCK DATA ---

const StatusBadge: React.FC<{ status: Agent['status'] }> = ({ status }) => {
    const statusClasses = {
        'Actif': 'bg-[#1f8a3a] text-white',
        'Inactif': 'bg-gray-200 text-gray-800',
    };
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const AgentsPage: React.FC = () => {
    const navigate = useNavigate();
    const [agents, setAgents] = useState<Agent[]>(mockAgents);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const matchesSearch =
                agent.name.toLowerCase().includes(lowerCaseQuery) ||
                agent.email.toLowerCase().includes(lowerCaseQuery);

            const matchesStatus =
                statusFilter === 'Tous' || agent.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter, agents]);

    const handleOpenModalForEdit = (agent: Agent) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };
    
    const handleOpenModalForAdd = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
    };

    const handleSaveAgent = (agentData: Omit<Agent, 'id' | 'avatar' | 'registrationsToday' | 'finesCollectedToday'> & { id?: string }) => {
        if (editingAgent) {
            // Update
            const updatedAgent = { ...editingAgent, ...agentData };
            setAgents(agents.map(a => a.id === editingAgent.id ? updatedAgent : a));
        } else {
            // Add
            const newAgent: Agent = {
                ...agentData,
                id: `agent-${Math.random().toString(36).substring(2, 9)}`,
                avatar: `${agentData.name.charAt(0)}${agentData.name.split(' ')[1]?.charAt(0) || ''}`.toUpperCase(),
                registrationsToday: 0,
                finesCollectedToday: 0,
            };
            setAgents(prev => [newAgent, ...prev]);
        }
        handleCloseModal();
    };

    const handleDeleteAgent = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
            setAgents(prev => prev.filter(a => a.id !== id));
        }
    };

    return (
        <>
            <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between mb-6 border-b border-black/5 pb-4">
                    <div>
                        <h1 className="text-xl font-bold text-[--text-main]">Gestion des Agents</h1>
                        <p className="text-sm text-[--text-muted]">Liste de tous les agents de terrain.</p>
                    </div>
                     <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom ou email..."
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
                                <option value="Actif">Actif</option>
                                <option value="Inactif">Inactif</option>
                            </select>
                             <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <button onClick={handleOpenModalForAdd} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
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
                                {['Agent', 'Enreg. (jour)', 'Amendes (jour)', 'Statut', 'Actions'].map(header => (
                                    <th key={header} scope="col" className={`px-6 py-3 text-left text-xs font-medium text-[--text-muted] uppercase tracking-wider ${header === 'Actions' ? 'text-right' : ''}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-black/5">
                            {filteredAgents.map((agent) => (
                                <tr 
                                    key={agent.id} 
                                    onClick={() => navigate(`/agents/${agent.id}`)} 
                                    className="hover:bg-brand-50/50 cursor-pointer rounded-lg transition-all"
                                    tabIndex={0}
                                    onKeyPress={(e) => e.key === 'Enter' && navigate(`/agents/${agent.id}`)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-brand-100 text-[--brand-600] font-bold rounded-full flex items-center justify-center">
                                                {agent.avatar}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-[--text-main]">{agent.name}</div>
                                                <div className="text-sm text-[--text-muted]">{agent.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[--text-main] font-semibold">{agent.registrationsToday}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[--text-main] font-semibold">{agent.finesCollectedToday.toLocaleString()} CDF</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={agent.status} /></td>
                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <ActionMenu
                                            onEdit={() => handleOpenModalForEdit(agent)}
                                            onDelete={() => handleDeleteAgent(agent.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <AddAgentModal agentToEdit={editingAgent} onClose={handleCloseModal} onSave={handleSaveAgent} />}
        </>
    );
};

export default AgentsPage;