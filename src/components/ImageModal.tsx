import { X, Download, Share2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  photographer?: string;
}

export function ImageModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title, 
  photographer
}: ImageModalProps) {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Confira esta foto: ${title}`,
          url: imageUrl
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div>
          <h3 className="text-xl font-medium text-white">{title}</h3>
          {photographer && (
            <p className="text-sm text-purple-300">by {photographer}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownload}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Download size={20} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Imagem Central */}
      <div className="h-full flex items-center justify-center p-4">
        <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  );
} 