import React, { useState } from 'react';
import { ExternalLink, Heart, Download, Share2, X } from 'lucide-react';
import { IconButton } from './ui/IconButton';
import { ImageModal } from './ImageModal';

interface PhotoCardProps {
  imageUrl: string;
  title: string;
  photographer?: string;
  onOpenModal: () => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export function PhotoCard({ imageUrl, title, photographer, onOpenModal, isModalOpen, onCloseModal }: PhotoCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl bg-gray-800 ring-1 ring-purple-900/10 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/20">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <IconButton
            icon={Heart}
            onClick={() => setIsLiked(!isLiked)}
            className={`${isLiked ? 'bg-purple-500 text-white' : 'bg-gray-900/50 text-purple-300'}`}
            tooltip={isLiked ? 'Unlike' : 'Like'}
          />
          <IconButton
            icon={Share2}
            onClick={() => navigator.share?.({ title, url: imageUrl })}
            className="bg-gray-900/50 text-yellow-300 hover:bg-yellow-500/30"
            tooltip="Share"
          />
        </div>
        
        <div className="aspect-video relative">
          {imageError ? (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
              <span>Erro ao carregar imagem</span>
            </div>
          ) : (
            <img 
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-purple-200 mb-3">by {photographer}</p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-purple-500 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-purple-600">
                <Download size={16} />
                <span>Download</span>
              </button>
              <button 
                onClick={onOpenModal}
                className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-300 backdrop-blur-sm transition-colors hover:bg-yellow-500/30"
              >
                <ExternalLink size={16} />
                <span>View Full</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        imageUrl={imageUrl}
        title={title}
        photographer={photographer}
      />
    </>
  );
}