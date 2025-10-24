import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import WebcamCapture from './WebcamCapture';
import { ModalHeader, ModalFooter, SectionTitle, FormField, FormRow } from './AgentFormComponents';

interface RegisterLicenseModalProps {
  onClose: () => void;
}

const RegisterLicenseModal: React.FC<RegisterLicenseModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nom: '', prenom: '', date_naissance: '', adresse: '', tel: '', email: '', nin: '',
    autorite: 'CNPC/RDC', restrictions: 'Aucune',
    photo_data: '',
  });
  const [cats, setCats] = useState<string[]>([]);
  const [isWebcamOpen, setWebcamOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setCats(prev => checked ? [...prev, value] : prev.filter(cat => cat !== value));
  };

  const handleCapture = (imageDataUrl: string) => {
    setFormData(prev => ({ ...prev, photo_data: imageDataUrl }));
    setWebcamOpen(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cats.length === 0) {
        alert("Veuillez sélectionner au moins une catégorie de permis.");
        return;
    }
    const fullData = { ...formData, cats };
    console.log("License Application Data Submitted:", fullData);
    alert("Demande de permis enregistrée avec succès (voir la console pour les données).");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <ModalHeader title="Enregistrer une Demande de Permis" onClose={onClose} color="yellow" />

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Photo Section */}
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 flex items-center justify-center overflow-hidden">
                  {formData.photo_data ? (
                    <img src={formData.photo_data} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button type="button" onClick={() => setWebcamOpen(true)} className="flex items-center px-4 py-2 text-sm bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                  <Camera className="w-4 h-4 mr-2" />
                  Prendre une photo
                </button>
                 <p className="text-xs text-gray-500 mt-2">Photo du demandeur</p>
              </div>

              {/* Personal Info */}
              <section>
                <SectionTitle>Informations personnelles</SectionTitle>
                <div className="space-y-4">
                   <FormRow>
                    <FormField label="Nom" id="nom" placeholder="Ex: Mukeba" value={formData.nom} onChange={handleChange} />
                    <FormField label="Prénom" id="prenom" placeholder="Ex: Salomon" value={formData.prenom} onChange={handleChange} />
                   </FormRow>
                   <FormRow>
                    <FormField label="Date de naissance" id="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} />
                    <FormField label="NIN (ID National)" id="nin" placeholder="Numéro d'identification national" value={formData.nin} onChange={handleChange} />
                   </FormRow>
                   <FormField fullWidth label="Adresse complète" id="adresse" placeholder="123 Avenue des Martyrs, Goma" value={formData.adresse} onChange={handleChange} />
                   <FormRow>
                    <FormField label="Téléphone" id="tel" placeholder="0812345678" value={formData.tel} onChange={handleChange} />
                    <FormField label="Email (optionnel)" id="email" placeholder="salomon.mukeba@example.com" type="email" value={formData.email} onChange={handleChange} />
                   </FormRow>
                </div>
              </section>
              
              {/* License Details */}
              <section>
                <SectionTitle>Détails du permis demandé</SectionTitle>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégories demandées <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                            {['A', 'B', 'C', 'D', 'E', 'F'].map(cat => (
                                <label key={cat} className="flex items-center text-sm text-gray-600 p-2 rounded-md hover:bg-gray-100">
                                    <input type="checkbox" value={cat} onChange={handleCatChange} className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500" />
                                    <span className="ml-2 font-medium">Catégorie {cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                     <FormRow>
                        <FormField label="Autorité d'émission" id="autorite" placeholder="CNPC/RDC" value={formData.autorite} onChange={handleChange} />
                        <FormField label="Restrictions (si applicable)" id="restrictions" placeholder="Aucune" value={formData.restrictions} onChange={handleChange} />
                    </FormRow>
                 </div>
              </section>
            </div>
            
            <ModalFooter onClose={onClose} submitLabel="Enregistrer Demande" />
          </form>
        </div>
      </div>
      {isWebcamOpen && <WebcamCapture onCapture={handleCapture} onClose={() => setWebcamOpen(false)} />}
    </>
  );
};

export default RegisterLicenseModal;
