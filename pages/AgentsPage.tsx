import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Agent } from '../types';
import { Search, Plus, FileDown } from 'lucide-react';
import ActionMenu from '../components/Admin/ActionMenu';
import AddAgentModal from '../components/Admin/AddAgentModal';

// MOCK DATA
const initialAgents: Agent[] = [
  { id: 'agent-1', name: 'Agent Tambua', email: 'agent@tambua.com', avatar: 'AT', status: 'Actif', registrationsToday: 5, finesCollectedToday: 120000 },
  { id: 'agent-2', name: 'John Doe', email: 'john.doe@tambua.com', avatar: 'JD', status: 'Actif', registrationsToday: 3, finesCollectedToday: 85000 },
  { id: 'agent-3', name: 'Jane Smith', email: 'jane.smith@tambua.com', avatar: 'JS', status: 'Inactif', registrationsToday: 0, finesCollectedToday: 0 },
  { id: 'agent-4', name: 'Pierre Simon', email: 'pierre.simon@tambua.com', avatar: 'PS', status: 'Actif', registrationsToday: 8, finesCollectedToday: 250000 },
];

const AgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>(initialAgents);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

    const filteredAgents = useMemo(() =>
        agents.filter(agent =>
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [agents, searchTerm]);
    
    const handleSave = (agentData: Omit<Agent, 'id' | 'avatar' | 'registrationsToday' | 'finesCollectedToday'>) => {
        if (editingAgent) {
            // Edit
            setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...editingAgent, ...agentData } : a));
        } else {
            // Add
            const newAgent: Agent = {
                ...agentData,
                id: `agent-${Date.now()}`,
                avatar: `${agentData.name.charAt(0)}${agentData.name.split(' ')[1]?.charAt(0) || ''}`.toUpperCase(),
                registrationsToday: 0,
                finesCollectedToday: 0
            };
            setAgents(prev => [newAgent, ...prev]);
        }
        setIsModalOpen(false);
        setEditingAgent(null);
    };

    const handleDelete = (agentId: string) => {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) {
            setAgents(prev => prev.filter(a => a.id !== agentId));
        }
    };
    
    const openAddModal = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (agent: Agent) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const exportToPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        const title = "Rapport des Agents";
        const date = new Date().toLocaleDateString('fr-CA');
        doc.text(title, 14, 15);
        doc.text(`Date: ${date}`, 14, 22);
    
        const head = [['Agent', 'Email', 'Statut', 'Enreg. (jour)', 'Amendes (jour, CDF)']];
        const body = filteredAgents.map(a => [
            a.name,
            a.email,
            a.status,
            a.registrationsToday,
            a.finesCollectedToday.toLocaleString(),
        ]);
    
        doc.autoTable({
            head: head,
            body: body,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [7, 166, 224] },
        });
    
        doc.save(`rapport_agents_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[--text-main]">Gestion des Agents</h1>
                    <p className="text-sm text-[--text-muted]">Ajoutez, modifiez et suivez les agents sur le terrain.</p>
                </div>

                <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-black/10 rounded-lg focus:ring-2 focus:ring-[--brand-400]"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={exportToPdf} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                                <FileDown className="w-4 h-4 mr-2" />
                                PDF
                            </button>
                            <button onClick={openAddModal} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                                <Plus className="w-5 h-5 mr-2" />
                                Ajouter un Agent
                            </button>
                        </div>
                    </div>

                     <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-[--text-muted] bg-brand-50/50">
                                <tr>
                                    <th className="p-3 font-semibold">Agent</th>
                                    <th className="p-3 font-semibold">Statut</th>
                                    <th className="p-3 font-semibold">Enregistrements (jour)</th>
                                    <th className="p-3 font-semibold">Amendes Perçues (jour)</th>
                                    <th className="p-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredAgents.map(agent => (
                                    <tr key={agent.id} className="border-t border-black/5 hover:bg-brand-50/50">
                                        <td className="p-3">
                                            <Link to={`/agents/${agent.id}`} className="flex items-center group">
                                                 <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-[--brand-600] font-bold mr-3">
                                                    {agent.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[--text-main] group-hover:text-[--brand-600]">{agent.name}</p>
                                                    <p className="text-xs text-[--text-muted]">{agent.email}</p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${agent.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {agent.status}
                                            </span>
                                        </td>
                                        <td className="p-3 font-semibold text-[--text-main]">{agent.registrationsToday}</td>
                                        <td className="p-3 font-semibold text-[--text-main]">{agent.finesCollectedToday.toLocaleString()} CDF</td>
                                        <td className="p-3">
                                            <ActionMenu onEdit={() => openEditModal(agent)} onDelete={() => handleDelete(agent.id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isModalOpen && <AddAgentModal onClose={() => setIsModalOpen(false)} onSave={handleSave} agentToEdit={editingAgent} />}
        </>
    );
};

export default AgentsPage;