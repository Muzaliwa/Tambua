import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Agent, AgentActivity } from '../types';
import { ChevronLeft, User, BarChart, List, Mail, Calendar, CheckCircle } from 'lucide-react';
import StatCard from '../components/Dashboard/StatCard';

// MOCK DATA
const mockAgents: Omit<Agent, 'registrationsToday' | 'finesCollectedToday'>[] = [
  { id: 'agent-1', name: 'Agent Tambua', email: 'agent@tambua.com', avatar: 'AT', status: 'Actif' },
  { id: 'agent-2', name: 'John Doe', email: 'john.doe@tambua.com', avatar: 'JD', status: 'Actif' },
  { id: 'agent-3', name: 'Jane Smith', email: 'jane.smith@tambua.com', avatar: 'JS', status: 'Inactif' },
];

const mockAgentDetails: { [key: string]: { stats: any; activities: AgentActivity[] } } = {
  'agent-1': {
    stats: { registrationsMonth: 48, finesCollectedMonth: 2150000, documentsPrintedMonth: 112 },
    activities: [
        { id: 'act-1', date: '2025-10-22T14:30:00Z', action: 'PAIEMENT_AMENDE', details: 'Plaque GOM 1005 AB', amount: 80000 },
        { id: 'act-2', date: '2025-10-22T11:05:00Z', action: 'ENREGISTREMENT_VEHICULE', details: 'Plaque KIN 89Z' },
        { id: 'act-3', date: '2025-10-22T09:15:00Z', action: 'IMPRESSION_PERMIS', details: 'Permis P123456789' },
        { id: 'act-4', date: '2025-10-21T15:00:00Z', action: 'ENREGISTREMENT_MOTO', details: 'Plaque GOM 789 EF' },
    ],
  },
  'agent-2': {
    stats: { registrationsMonth: 25, finesCollectedMonth: 850000, documentsPrintedMonth: 60 },
    activities: [
        { id: 'act-5', date: '2025-10-22T10:00:00Z', action: 'PAIEMENT_AMENDE', details: 'Plaque BB123C', amount: 50000 },
    ],
  },
  'agent-3': {
    stats: { registrationsMonth: 2, finesCollectedMonth: 75000, documentsPrintedMonth: 5 },
    activities: [],
  },
};
// END MOCK DATA

const actionDisplay: { [key in AgentActivity['action']]: { label: string; color: string; } } = {
    'ENREGISTREMENT_VEHICULE': { label: 'Enregistrement Véhicule', color: 'blue' },
    'ENREGISTREMENT_MOTO': { label: 'Enregistrement Moto', color: 'green' },
    'PAIEMENT_AMENDE': { label: 'Paiement Amende', color: 'red' },
    'IMPRESSION_PERMIS': { label: 'Impression Permis', color: 'gray' },
};

const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const agent = mockAgents.find(a => a.id === id);
  const details = id ? mockAgentDetails[id] : null;

  if (!agent || !details) {
    return <div className="p-4">Agent non trouvé.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/agents" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Retour à la liste des agents
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Rapport de l'Agent: {agent.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Agent Profile */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-4xl mx-auto mb-4">
                    {agent.avatar}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{agent.name}</h2>
                <p className="text-sm text-gray-500">{agent.email}</p>
                 <span className={`mt-2 inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${agent.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    <CheckCircle className="w-3 h-3 mr-1.5"/>
                    {agent.status}
                </span>
            </div>
            {/* More info can be added here */}
        </div>
        
        {/* Right Column - Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Enregistrements (Mois)" value={details.stats.registrationsMonth.toString()} icon={User} description="" />
                <StatCard title="Amendes (Mois)" value={`${(details.stats.finesCollectedMonth / 1000).toFixed(0)}K`} icon={BarChart} description="CDF perçus" />
                <StatCard title="Impressions (Mois)" value={details.stats.documentsPrintedMonth.toString()} icon={List} description="documents imprimés" />
             </div>
             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Activité Récente</h3>
                <div className="overflow-x-auto">
                    {details.activities.length > 0 ? (
                        <table className="min-w-full text-sm">
                            <thead className="text-left text-gray-500">
                                <tr>
                                    <th className="p-2 font-medium">Date</th>
                                    <th className="p-2 font-medium">Action</th>
                                    <th className="p-2 font-medium">Détails</th>
                                    <th className="p-2 font-medium text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.activities.map(act => {
                                    const displayInfo = actionDisplay[act.action];
                                    return (
                                        <tr key={act.id} className="border-t">
                                            <td className="p-2 whitespace-nowrap">{new Date(act.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                                            <td className="p-2 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${displayInfo.color}-100 text-${displayInfo.color}-800`}>{displayInfo.label}</span>
                                            </td>
                                            <td className="p-2">{act.details}</td>
                                            <td className="p-2 text-right font-mono">{act.amount ? `${act.amount.toLocaleString()} FC` : '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Aucune activité récente pour cet agent.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
