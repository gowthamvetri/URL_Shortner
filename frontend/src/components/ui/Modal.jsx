import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-lg rounded-xl border-2 border-black bg-card p-6 shadow-hard-lg duration-200">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-extrabold leading-none tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="rounded-full bg-accent p-1 border-2 border-transparent hover:border-black opacity-80 transition-all hover:opacity-100 hover:shadow-hard focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};
