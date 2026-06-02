import { Modal } from './ui/Modal';
import { Download } from 'lucide-react';

export const QRCodeModal = ({ isOpen, onClose, url }) => {
  if (!url || !url.qrCode) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url.qrCode;
    link.download = `qrcode-${url.shortCode || 'link'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Code">
      <div className="flex flex-col items-center justify-center space-y-6 py-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <img 
            src={url.qrCode} 
            alt={`QR Code for ${url.shortCode}`} 
            className="h-48 w-48 object-contain"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground max-w-[300px] truncate">
            {url.originalUrl}
          </p>
          <p className="text-sm text-muted-foreground">
            Scan to visit the original URL
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-8 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none w-full sm:w-auto"
        >
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </button>
      </div>
    </Modal>
  );
};
