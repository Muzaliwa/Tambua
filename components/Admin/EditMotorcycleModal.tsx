import React, { useState } from 'react';
import { Motorcycle } from '../../types';
import { ModalHeader, ModalFooter, FormField, FormRow } from '../Agent/AgentFormComponents';

interface EditMotorcycleModalProps {
  onClose: () => void;
  onSave: (updatedMotorcycle: Motorcycle) => void;
  motorcycle: Motorcycle;
}

const EditMotorcycleModal: React.FC<EditMotorcycleModalProps> = ({ onClose, onSave, motorcycle }) => {
  const [formData, setFormData] = useState<Motorcycle>(motorcycle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          <ModalHeader title={`Modifier Moto: ${motorcycle.plate}`} onClose={onClose} color="green" />
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <FormRow>
              <FormField label="Plaque" id="plate" value={formData.plate} onChange={handleChange} />
              <FormField label="Marque / Modèle" id="makeModel" value={formData.makeModel} onChange={handleChange} />
            </FormRow>
            <FormRow>
              <FormField label="Année" id="year" type="number" value={String(formData.year)} onChange={handleChange} />
              <FormField label="Couleur" id="color" value={formData.color} onChange={handleChange} />
            </FormRow>
             <hr className="my-4" />
             <FormField fullWidth label="Propriétaire" id="owner" value={formData.owner} onChange={handleChange} />
            <FormField fullWidth label="Adresse" id="address" value={formData.address} onChange={handleChange} />
          </div>
          <ModalFooter onClose={onClose} submitLabel="Enregistrer" isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
};

export default EditMotorcycleModal;
