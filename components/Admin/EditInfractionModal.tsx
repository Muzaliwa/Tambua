import React, { useState } from 'react';
import { Infraction } from '../../types';
import { ModalHeader, ModalFooter, FormField, FormRow } from '../Agent/AgentFormComponents';

interface EditInfractionModalProps {
  onClose: () => void;
  onSave: (updatedInfraction: Infraction) => void;
  infraction: Infraction;
}

const EditInfractionModal: React.FC<EditInfractionModalProps> = ({ onClose, onSave, infraction }) => {
  const [formData, setFormData] = useState<Infraction>(infraction);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value, 10) || 0 : value,
    }));
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
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <form onSubmit={handleSubmit}>
          <ModalHeader title={`Modifier Infraction: ${infraction.code}`} onClose={onClose} />
          <div className="p-6 space-y-4">
            <FormRow>
              <FormField
                label="Code de l'infraction"
                id="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
              <FormField
                label="Label"
                id="label"
                value={formData.label}
                onChange={handleChange}
                required
              />
            </FormRow>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <FormRow>
              <div className="flex-1">
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">Sévérité</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900"
                >
                  <option value="LEGER">Léger</option>
                  <option value="MOYEN">Moyen</option>
                  <option value="GRAVE">Grave</option>
                  <option value="TRES_GRAVE">Très Grave</option>
                </select>
              </div>
              <FormField
                label="Montant de l'amende (CDF)"
                id="amount"
                type="number"
                value={formData.amount.toString()}
                onChange={handleChange}
                required
              />
            </FormRow>
          </div>
          <ModalFooter onClose={onClose} submitLabel="Enregistrer" isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default EditInfractionModal;