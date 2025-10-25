import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Agent, AgentActivity } from '../types';
import { ChevronLeft, Mail, Calendar, Hash, DollarSign, List } from 'lucide-react';

// --- MOCK DATA ---
const mockAgents: Agent[] = [
  { id: 'agent-1', name: 'Agent Tambua', email: 'agent@tambua.com', avatar: 'AT', status: 'Actif', registrationsToday: 5, finesCollectedToday: 120000 },
  { id: 'agent-2', name: 'John Doe', email: 'john.doe@tambua.com', avatar: 'JD', status: 'Actif', registrationsToday: 3, finesCollectedToday: 85000 },
  { id: 'agent-3', name: 'Jane Smith', email: 'jane.smith@tambua.com', avatar: 'JS', status: 'Inactif', registrationsToday: 0, finesCollectedToday: 0 },
  { id: 'agent-4', name: 'Pierre Simon', email: 'pierre.simon@tambua.com', avatar: 'PS', status: 'Actif', registrationsToday: 8, finesCollectedToday: 250000 },
];

const mockActivities: { [agentId: string]: AgentActivity[] } = {
    'agent-1': [
        { id: 'a1', date: '2025-10-22T10:05:00Z', action: 'PAIEMENT_AMENDE', details: 'Amende #F-4562, Plaque BB123C', amount: 50000 },
        { id: 'a2', date: '2025-10-22T09:45:00Z', action: 'ENREGISTREMENT_MOTO', details: 'Plaque GOM 101 GH' },
        { id: 'a3', date: '2025-10-22T09:15:00Z', action: 'IMPRESSION_PERMIS', details: 'Permis P123456789' },
    ],
    'agent-2': [
         { id: 'b1', date: '2025-10-22T11:00:00Z', action: 'ENREGISTREMENT_VEHICULE', details: 'Plaque KIN22X' },
    ],
    'agent-3': [],
    'agent-4': [
        { id: 'd1', date: '2025-10-22T12:00:00Z', action: 'PAIEMENT_AMENDE', details: 'Amende #F-9876, Plaque GOM45D', amount: 80000 },
    ],
};
// --- END MOCK DATA ---

const InfoItem: React.FC<{ label: string; value: string | React.ReactNode; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-[--text-muted] mt-1" />
        <div className="ml-4">
            <p className="text-sm text-[--text-muted]">{label}</p>
            <p className="text-base font-semibold text-[--text-main]">{value}</p>
        </div>
    </div>
);

const ActivityItem: React.FC<{ activity: AgentActivity }> = ({ activity }) => {
    const actionDetails = {
        ENREGISTREMENT_VEHICULE: { text: "Enregistrement Véhicule", color: "blue" },
        PAIEMENT_AMENDE: { text: "Paiement Amende", color: "green" },
        IMPRESSION_PERMIS: { text: "Impression Permis", color: "purple" },
        ENREGISTREMENT_MOTO: { text: "Enregistrement Moto", color: "yellow" },
    };
    
    const { text, color } = actionDetails[activity.action];
    
    return (
        <li className="flex items-start space-x-4 py-4">
            <div className={`w-2 h-2 mt-2 rounded-full bg-${color}-500`}></div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-[--text-main]">{text}</p>
                    <p className="text-xs text-[--text-muted]">{new Date(activity.date).toLocaleTimeString('fr-FR')}</p>
                </div>
                <p className="text-sm text-[--text-muted]">{activity.details}</p>
                {activity.amount && (
                    <p className="text-sm font-semibold text-green-600 mt-1">{activity.amount.toLocaleString()} CDF</p>
                )}
            </div>
        </li>
    );
};

const AgentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const agent = mockAgents.find(a => a.id === id);
    const activities = id ? mockActivities[id] || [] : [];

    if (!agent) {
        return <div className="p-8 text-center">Agent non trouvé.</div>;
    }

    return (
        <div className="space-y-8">
             <div>
                <Link to="/agents" className="flex items-center text-sm text-[--brand-600] hover:underline mb-2">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Retour à la liste des agents
                </Link>
                <h1 className="text-2xl font-bold text-[--text-main]">Profil de l'Agent</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Agent Info Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5 space-y-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-brand-100 text-[--brand-600] font-bold text-3xl rounded-full flex items-center justify-center mb-4">
                                {agent.avatar}
                            </div>
                            <h2 className="text-xl font-bold text-[--text-main]">{agent.name}</h2>
                            <span className={`px-3 py-1 mt-2 text-xs font-semibold rounded-full ${agent.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {agent.status}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <InfoItem label="Email" value={agent.email} icon={Mail} />
                            <InfoItem label="ID Agent" value={agent.id} icon={Hash} />
                            <InfoItem label="Enregistrements (jour)" value={agent.registrationsToday} icon={List} />
                            <InfoItem label="Amendes perçues (jour)" value={`${agent.finesCollectedToday.toLocaleString()} CDF`} icon={DollarSign} />
                        </div>
                    </div>
                </div>

                {/* Agent Activity */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
                        <div className="flex items-center text-lg font-semibold text-[--text-main] mb-4">
                            <Calendar className="w-6 h-6 mr-3 text-[--brand-400]" />
                            Activité Récente (Aujourd'hui)
                        </div>
                        {activities.length > 0 ? (
                             <ul className="divide-y divide-black/5">
                                {activities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
                            </ul>
                        ) : (
                            <p className="text-sm text-center text-[--text-muted] py-8">Aucune activité enregistrée pour aujourd'hui.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailPage;