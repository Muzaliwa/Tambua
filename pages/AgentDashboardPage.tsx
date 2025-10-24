import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Car, Bike, UserPlus, CircleDollarSign, Printer, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RegisterMotorcycleModal from '../components/Agent/RegisterMotorcycleModal';
import RegisterVehicleModal from '../components/Agent/RegisterVehicleModal';
import RegisterLicenseModal from '../components/Agent/RegisterLicenseModal';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--brand-400]"
  >
    <div className={`p-3 rounded-full inline-block mb-4`} style={{ backgroundColor: `${color}20`}}>
      <Icon className="w-8 h-8" style={{ color: color }} />
    </div>
    <h3 className="text-lg font-bold text-[--text-main] mb-2">{title}</h3>
    <p className="text-sm text-[--text-muted]">{description}</p>
  </button>
);

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
  };
  
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-brand-50/60 p-4 rounded-lg flex items-start">
      <div className={`p-3 rounded-full mr-4 ${selectedColor.bg}`}>
        <Icon className={`w-6 h-6 ${selectedColor.text}`} />
      </div>
      <div>
        <p className="text-sm text-[--text-muted]">{label}</p>
        <p className="text-xl font-bold text-[--text-main]">{value}</p>
      </div>
    </div>
  );
};

const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMotorcycleModalOpen, setMotorcycleModalOpen] = useState(false);
  const [isVehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [isLicenseModalOpen, setLicenseModalOpen] = useState(false);

  const actions = [
    { title: 'Enregistrer un Véhicule', description: 'Ajouter une nouvelle voiture au système.', icon: Car, color: 'var(--brand-400)', action: () => setVehicleModalOpen(true) },
    { title: 'Enregistrer une Moto', description: 'Ajouter une nouvelle moto au système.', icon: Bike, color: '#10B981', action: () => setMotorcycleModalOpen(true) },
    { title: 'Demande de Permis', description: 'Enregistrer une nouvelle demande de permis de conduire.', icon: UserPlus, color: '#F59E0B', action: () => setLicenseModalOpen(true) },
    { title: 'Payer une Amende', description: 'Faciliter le paiement des amendes pour les citoyens.', icon: CircleDollarSign, color: '#EF4444', action: () => navigate('/local-payment-simulator') },
  ];

  // Mock data for the agent's report
  const agentReportData = {
    vehicleRegistrations: 12,
    motorcycleRegistrations: 34,
    licenseRegistrations: 21,
    prints: {
        permis: 18,
        carteRose: 25,
        attestationMotard: 40,
    },
    finePaymentsCount: 45,
    finePaymentsValue: 1850000,
  };

  return (
    <>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[--text-main]">Portail Agent</h1>
          <p className="text-sm text-[--text-muted]">
            Bienvenue, {user?.name}. Gérez les enregistrements et les paiements ici.
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action) => (
            <ActionCard key={action.title} {...action} onClick={action.action} />
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12 bg-gradient-to-b from-white/90 to-white/85 p-6 rounded-xl shadow-glass border border-black/5">
          <h2 className="text-lg font-semibold text-[--text-main] mb-4">Rapport d'Activité Journalier</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatItem icon={Car} label="Véhicules enregistrés" value={agentReportData.vehicleRegistrations} color="blue" />
            <StatItem icon={Bike} label="Motos enregistrées" value={agentReportData.motorcycleRegistrations} color="green" />
            <StatItem icon={UserPlus} label="Demandes de permis" value={agentReportData.licenseRegistrations} color="yellow" />
            <StatItem 
              icon={Printer} 
              label="Impressions (Total)" 
              value={agentReportData.prints.permis + agentReportData.prints.carteRose + agentReportData.prints.attestationMotard} 
              color="gray"
            />
            <StatItem icon={CircleDollarSign} label="Amendes payées" value={agentReportData.finePaymentsCount} color="red" />
            <StatItem 
              icon={Coins} 
              label="Valeur des amendes" 
              value={`${agentReportData.finePaymentsValue.toLocaleString('fr-FR')} FC`}
              color="indigo"
            />
          </div>
          <div className="mt-6 border-t border-black/5 pt-4">
              <h3 className="text-md font-semibold text-[--text-muted] mb-3">Détail des impressions</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                  <span className="bg-brand-100 text-[--text-main] px-3 py-1.5 rounded-full">Permis: <span className="font-bold ml-1">{agentReportData.prints.permis}</span></span>
                  <span className="bg-brand-100 text-[--text-main] px-3 py-1.5 rounded-full">Cartes Roses: <span className="font-bold ml-1">{agentReportData.prints.carteRose}</span></span>
                  <span className="bg-brand-100 text-[--text-main] px-3 py-1.5 rounded-full">Attestations Motard: <span className="font-bold ml-1">{agentReportData.prints.attestationMotard}</span></span>
              </div>
          </div>
        </div>
      </div>
      
      {isMotorcycleModalOpen && <RegisterMotorcycleModal onClose={() => setMotorcycleModalOpen(false)} />}
      {isVehicleModalOpen && <RegisterVehicleModal onClose={() => setVehicleModalOpen(false)} />}
      {isLicenseModalOpen && <RegisterLicenseModal onClose={() => setLicenseModalOpen(false)} />}
    </>
  );
};

export default AgentDashboardPage;