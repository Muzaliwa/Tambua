import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Printer, Loader } from 'lucide-react';

// Make jspdf and html2canvas available from window
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface PdfPreviewModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ onClose, title, children }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pdfInstanceRef = useRef<any>(null); // To hold the jsPDF instance

  useEffect(() => {
    const generatePdf = async () => {
      // Small delay to ensure content is rendered
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (!contentRef.current) {
        setError("Le contenu à imprimer est introuvable.");
        setIsLoading(false);
        return;
      }

      if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        setError("Les bibliothèques de génération PDF n'ont pas pu être chargées.");
        setIsLoading(false);
        return;
      }
      
      try {
        const { jsPDF } = window.jspdf;
        const canvas = await window.html2canvas(contentRef.current, {
          scale: 3, // Higher scale for better quality
          useCORS: true,
          backgroundColor: null,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [85.6, 53.98], // CR80 card size
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
        pdfInstanceRef.current = pdf;

        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        
      } catch (err) {
        console.error("Erreur lors de la génération du PDF:", err);
        setError("Une erreur est survenue lors de la création du PDF.");
      } finally {
        setIsLoading(false);
      }
    };

    generatePdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  const handleDownload = () => {
    if (pdfInstanceRef.current) {
      pdfInstanceRef.current.save(`${title.replace(/\s+/g, '_')}.pdf`);
    }
  };
  
  const handlePrint = () => {
     if (pdfInstanceRef.current) {
        // Use the print functionality of the PDF viewer in the iframe
        const iframe = document.getElementById('pdf-preview-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
        }
     }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 no-print">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-2">
            {pdfUrl && (
              <>
                <button onClick={handleDownload} className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                </button>
                <button onClick={handlePrint} className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer
                </button>
              </>
            )}
            <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Area */}
        <div className="flex-1 bg-gray-200 flex items-center justify-center min-h-[70vh]">
          {isLoading && <div className="flex flex-col items-center text-gray-600"><Loader className="animate-spin w-8 h-8 mb-2" /><span>Génération du PDF...</span></div>}
          {error && <div className="text-red-600 p-4">{error}</div>}
          {pdfUrl && <iframe id="pdf-preview-iframe" src={pdfUrl} className="w-full h-full border-0" title={title} />}
        </div>
      </div>
      
      {/* Hidden container for html2canvas to render the element before capturing */}
      <div className="fixed left-[-9999px] top-[-9999px]" aria-hidden="true">
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
