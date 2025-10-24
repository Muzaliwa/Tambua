import React, { useState } from 'react';
import { Fine } from '../../types';
import { ModalHeader, ModalFooter, FormField, FormRow } from '../Agent/AgentFormComponents';

interface EditFineModalProps {
  onClose: () => void;
  onSave: (updatedFine: Fine) => void;
  fine: Fine;
}

const EditFineModal: React.FC<EditFineModalProps> = ({ onClose, onSave, fine }) => {
  const [formData, setFormData] = useState<Fine>(fine);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
          <ModalHeader title={`Modifier Amende: ${fine.plate}`} onClose={onClose} color="red" />
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <FormRow>
              <FormField label="Plaque" id="plate" value={formData.plate} onChange={handleChange} disabled />
              <FormField label="Conducteur" id="driver" value={formData.driver} onChange={handleChange} disabled />
            </FormRow>
            <FormField fullWidth label="Motif" id="reason" value={formData.reason} onChange={handleChange} />
            <FormRow>
              <FormField
                label="Montant (CDF)"
                id="amount"
                type="number"
                value={String(formData.amount)}
                onChange={handleChange}
              />
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900"
                >
                  <option value="En attente">En attente</option>
                  <option value="Payée">Payée</option>
                  <option value="En retard">En retard</option>
                </select>
              </div>
            </FormRow>
          </div>
          <ModalFooter onClose={onClose} submitLabel="Enregistrer" isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default EditFineModal;