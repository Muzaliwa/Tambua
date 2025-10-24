import React, { useState, useEffect } from 'react';
import { Agent } from '../../types';
import { ModalHeader, ModalFooter, FormField } from '../Agent/AgentFormComponents';

interface AddAgentModalProps {
  onClose: () => void;
  onSave: (agentData: Omit<Agent, 'id' | 'avatar' | 'registrationsToday' | 'finesCollectedToday'>) => void;
  agentToEdit?: Agent | null;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ onClose, onSave, agentToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'Actif' as Agent['status'],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!agentToEdit;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: agentToEdit.name,
        email: agentToEdit.email,
        status: agentToEdit.status,
      });
    }
  }, [agentToEdit, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <ModalHeader title={isEditMode ? "Modifier l'Agent" : "Ajouter un Agent"} onClose={onClose} />
          <div className="p-6 space-y-4">
            <FormField
              label="Nom complet"
              id="name"
              placeholder="Ex: John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormField
              label="Adresse e-mail"
              id="email"
              type="email"
              placeholder="Ex: john.doe@tambua.com"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
            {!isEditMode && (
              <p className="text-xs text-gray-500 pt-2">Un mot de passe temporaire sera envoyé à l'adresse e-mail de l'agent.</p>
            )}
          </div>
          <ModalFooter onClose={onClose} submitLabel={isEditMode ? "Enregistrer" : "Ajouter Agent"} isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal;