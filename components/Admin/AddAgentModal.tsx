import React, { useState } from 'react';
import { Agent } from '../../types';
import { ModalHeader, ModalFooter, FormField, FormRow } from '../Agent/AgentFormComponents';

interface AddAgentModalProps {
  onClose: () => void;
  onAdd: (newAgentData: Omit<Agent, 'id' | 'avatar' | 'registrationsToday' | 'finesCollectedToday' | 'status'>) => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onAdd({ name: formData.name, email: formData.email });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <form onSubmit={handleSubmit}>
          <ModalHeader title="Ajouter un nouvel Agent" onClose={onClose} />
          <div className="p-6 space-y-4">
            <FormField
              label="Nom complet"
              id="name"
              placeholder="Ex: Jean Dupont"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormField
              label="Adresse e-mail"
              id="email"
              type="email"
              placeholder="Ex: j.dupont@tambua.com"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormField
              label="Mot de passe temporaire"
              id="password"
              type="password"
              placeholder="Créez un mot de passe sécurisé"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          <ModalFooter onClose={onClose} submitLabel="Ajouter l'Agent" isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal;
