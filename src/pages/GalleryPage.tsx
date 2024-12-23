import { useEffect, useState } from 'react';
import { PhotoCard } from '../components/PhotoCard';
import { HeroSection } from '../components/HeroSection';
import { supabase } from '../lib/supabase';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import toast from 'react-hot-toast';

interface GalleryImage {
  id: number;
  title: string;
  photographer: string;
  image_url: string;
  created_at?: string;
}

export function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setImages(data);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="py-12 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-8">
            <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
              Galeria de Fotos da Inauguração
            </span>
          </h2>
          
          {loading ? (
            <div className="text-center text-gray-400 py-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-8 mb-4">
                  <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <span>Carregando imagens...</span>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>Nenhuma imagem encontrada.</p>
              <p className="text-sm mt-2">As imagens aparecerão aqui após serem adicionadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image, index) => (
                <div key={image.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors">
                  <div className="">
                    <PhotoCard
                      imageUrl={image.image_url}
                      title={image.title}
                      photographer={image.photographer}
                      onOpenModal={() => handleOpenModal(index)}
                      isModalOpen={isModalOpen && currentImageIndex === index}
                      onCloseModal={() => setIsModalOpen(false)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 