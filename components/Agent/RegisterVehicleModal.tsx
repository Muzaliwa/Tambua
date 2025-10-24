import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';
import WebcamCapture from './WebcamCapture';
import { ModalHeader, ModalFooter, SectionTitle, FormField, FormRow } from './AgentFormComponents';

interface RegisterVehicleModalProps {
  onClose: () => void;
}

const RegisterVehicleModal: React.FC<RegisterVehicleModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    plaque: '', type: '', annee: '', marque: '', modele: '', statut: 'Actif',
    nom: '', prenom: '', nin: '', adresse: '', tel: '', email: '',
    date_naissance: '', date_emission: '', autorite: '', numero_licence: '', date_expiration: '', restrictions: '',
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
    const fullData = { ...formData, cats };
    console.log("Vehicle Data Submitted:", fullData);
    alert("Véhicule enregistré avec succès (voir la console pour les données).");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <ModalHeader title="Enregistrer un Véhicule" onClose={onClose} color="blue" />

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
                 <p className="text-xs text-gray-500 mt-2">Photo du propriétaire / conducteur</p>
              </div>

              {/* Vehicle Info */}
              <section>
                <SectionTitle>Informations sur le véhicule</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField label="Plaque" id="plaque" placeholder="GOM 123 AB" value={formData.plaque} onChange={handleChange} />
                  <FormField label="Marque" id="marque" placeholder="Toyota" value={formData.marque} onChange={handleChange} />
                  <FormField label="Modèle" id="modele" placeholder="RAV4" value={formData.modele} onChange={handleChange} />
                  <FormField label="Type" id="type" placeholder="SUV" value={formData.type} onChange={handleChange} />
                  <FormField label="Année" id="annee" placeholder="2022" type="number" value={formData.annee} onChange={handleChange} />
                </div>
              </section>

              {/* Owner Info */}
              <section>
                <SectionTitle>Informations sur le propriétaire</SectionTitle>
                <div className="space-y-4">
                   <FormRow>
                    <FormField label="Nom" id="nom" placeholder="Doe" value={formData.nom} onChange={handleChange} />
                    <FormField label="Prénom" id="prenom" placeholder="John" value={formData.prenom} onChange={handleChange} />
                   </FormRow>
                   <FormField fullWidth label="NIN (ID National)" id="nin" placeholder="Numéro d'identification national" value={formData.nin} onChange={handleChange} />
                   <FormField fullWidth label="Adresse" id="adresse" placeholder="123 Avenue des Grands Lacs" value={formData.adresse} onChange={handleChange} />
                   <FormRow>
                    <FormField label="Téléphone" id="tel" placeholder="0812345678" value={formData.tel} onChange={handleChange} />
                    <FormField label="Email" id="email" placeholder="john.doe@example.com" type="email" value={formData.email} onChange={handleChange} />
                   </FormRow>
                </div>
              </section>
              
              {/* License Info */}
              <section>
                <SectionTitle>Informations sur le permis de conduire</SectionTitle>
                 <div className="space-y-4">
                    <FormRow>
                        <FormField label="N° de Permis" id="numero_licence" placeholder="P123456789" value={formData.numero_licence} onChange={handleChange} />
                        <FormField label="Date de naissance" id="date_naissance" placeholder="" type="date" value={formData.date_naissance} onChange={handleChange} />
                    </FormRow>
                    <FormRow>
                        <FormField label="Date d'émission" id="date_emission" placeholder="" type="date" value={formData.date_emission} onChange={handleChange} />
                        <FormField label="Date d'expiration" id="date_expiration" placeholder="" type="date" value={formData.date_expiration} onChange={handleChange} />
                    </FormRow>
                     <FormRow>
                        <FormField label="Autorité d'émission" id="autorite" placeholder="CNPC/RDC" value={formData.autorite} onChange={handleChange} />
                        <FormField label="Restrictions" id="restrictions" placeholder="Aucune" value={formData.restrictions} onChange={handleChange} />
                    </FormRow>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {['A', 'B', 'C', 'D', 'E', 'F'].map(cat => (
                                <label key={cat} className="flex items-center text-sm text-gray-600">
                                    <input type="checkbox" value={cat} onChange={handleCatChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    <span className="ml-2">Catégorie {cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                 </div>
              </section>
            </div>
            
            <ModalFooter onClose={onClose} submitLabel="Enregistrer Véhicule" />
          </form>
        </div>
      </div>
      {isWebcamOpen && <WebcamCapture onCapture={handleCapture} onClose={() => setWebcamOpen(false)} />}
    </>
  );
};

export default RegisterVehicleModal;
