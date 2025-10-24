import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        yellow: 'bg-yellow-500',
        red: 'bg-red-600',
    };

    return (
        <div className={`p-4 flex justify-between items-center text-white ${colorClasses[color]} rounded-t-lg`}>
            <h2 className="text-lg font-bold">{title}</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

interface ModalFooterProps {
  onClose: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ onClose, submitLabel, isSubmitting }) => (
    <div className="p-4 bg-gray-50 border-t rounded-b-lg flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
            Annuler
        </button>
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {isSubmitting ? 'Enregistrement...' : submitLabel}
        </button>
    </div>
);

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  fullWidth?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, id, fullWidth, ...props }) => (
    <div className={fullWidth ? 'w-full' : 'flex-1'}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={id}
            name={id}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            {...props}
        />
    </div>
);

export const FormRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col md:flex-row gap-4">
        {children}
    </div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">{children}</h3>
);