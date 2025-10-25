import React from 'react';
import { X, Printer, Download } from 'lucide-react';

interface PdfPreviewModalProps {
  pdfUrl: string;
  onClose: () => void;
  title?: string;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ pdfUrl, onClose, title = "Aperçu du Document" }) => {
  const handlePrint = () => {
    const iframe = document.getElementById('pdf-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center bg-gray-50 border-b border-black/5 rounded-t-lg">
          <h2 className="text-lg font-semibold text-[--text-main]">{title}</h2>
          <div className="flex items-center space-x-2">
            <a href={pdfUrl} download title="Télécharger" className="p-2 rounded-full text-[--text-muted] hover:bg-gray-200">
              <Download className="w-5 h-5" />
            </a>
             <button onClick={handlePrint} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[linear-gradient(90deg,var(--brand-400),var(--brand-600))] hover:shadow-lg hover:shadow-[--brand-400]/20 rounded-lg transition-shadow">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
            </button>
            <button onClick={onClose} title="Fermer" className="p-2 rounded-full text-[--text-muted] hover:bg-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-2 bg-gray-200">
          <iframe
            id="pdf-iframe"
            src={pdfUrl}
            title={title}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;