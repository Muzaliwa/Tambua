import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import WebcamCapture from './WebcamCapture';
import { ModalHeader, ModalFooter, FormField, FormRow } from './AgentFormComponents';

interface RegisterMotorcycleModalProps {
  onClose: () => void;
}

const RegisterMotorcycleModal: React.FC<RegisterMotorcycleModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nom_detenteur: '',
    adresse_detenteur: '',
    tel_detenteur: '',
    plaque_numero: '',
    marque_modele: '',
    qr_numero: '',
    annee_fabrication: '',
    couleur: '',
    province: '',
    detenteur_photo_url: '',
  });
  const [isWebcamOpen, setWebcamOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapture = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, detenteur_photo_url: imageDataUrl }));
    setWebcamOpen(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Motorcycle Data Submitted:", formData);
    alert("Moto enregistrée avec succès (voir la console pour les données).");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <ModalHeader title="Enregistrer une Moto" onClose={onClose} color="green" />

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Photo Section */}
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden">
                  {formData.detenteur_photo_url ? (
                    <img src={formData.detenteur_photo_url} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button type="button" onClick={() => setWebcamOpen(true)} className="flex items-center px-4 py-2 text-sm bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                  <Camera className="w-4 h-4 mr-2" />
                  Prendre une photo
                </button>
                 <p className="text-xs text-gray-500 mt-2">Utiliser la webcam pour la photo du détenteur</p>
              </div>

              {/* Fields Section */}
              <div className="space-y-4">
                  <FormRow>
                    <FormField label="Nom du détenteur" id="nom_detenteur" placeholder="Ex: Jean-Claude" value={formData.nom_detenteur} onChange={handleChange} />
                    <FormField label="Téléphone détenteur" id="tel_detenteur" placeholder="Ex: 0991234567" value={formData.tel_detenteur} onChange={handleChange} />
                  </FormRow>
                  
                  <FormField fullWidth label="Adresse du détenteur" id="adresse_detenteur" placeholder="Ex: 123 Avenue des Volcans, Goma" value={formData.adresse_detenteur} onChange={handleChange} />
                  
                  <FormRow>
                    <FormField label="N° Plaque" id="plaque_numero" placeholder="Ex: GOM 123 AB" value={formData.plaque_numero} onChange={handleChange} />
                    <FormField label="Marque / Modèle" id="marque_modele" placeholder="Ex: TVS, Haojue" value={formData.marque_modele} onChange={handleChange} />
                  </FormRow>
                  
                  <FormRow>
                    <FormField label="Année de fabrication" id="annee_fabrication" placeholder="Ex: 2023" type="number" value={formData.annee_fabrication} onChange={handleChange} />
                    <FormField label="Couleur" id="couleur" placeholder="Ex: Noire" value={formData.couleur} onChange={handleChange} />
                  </FormRow>

                  <FormRow>
                    <FormField label="N° QR Code" id="qr_numero" placeholder="Scannez ou entrez le numéro" value={formData.qr_numero} onChange={handleChange} />
                    <FormField label="Province" id="province" placeholder="Ex: Nord-Kivu" value={formData.province} onChange={handleChange} />
                  </FormRow>
              </div>
            </div>

            <ModalFooter onClose={onClose} submitLabel="Enregistrer Moto" />
          </form>
        </div>
      </div>
      {isWebcamOpen && <WebcamCapture onCapture={handleCapture} onClose={() => setWebcamOpen(false)} />}
    </>
  );
};

export default RegisterMotorcycleModal;
