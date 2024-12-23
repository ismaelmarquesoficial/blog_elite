import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface StorageImage {
  name: string;
  url: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageName: string;
}

function ConfirmModal({ isOpen, onClose, onConfirm, imageName }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Confirmar Exclusão</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Tem certeza que deseja excluir a imagem <span className="text-amber-400">{imageName}</span>?
          <br />
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export function StorageImagePreview() {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    imageName: ''
  });

  const fetchStorageImages = async () => {
    try {
      setLoading(true);
      console.log('Iniciando busca de imagens...');
      
      const { data: files, error: listError } = await supabase
        .storage
        .from('images')
        .list('blog', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' }
        });

      console.log('Arquivos encontrados:', { files, listError });

      if (listError) throw listError;

      // Gerar URLs públicas para cada arquivo
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          console.log('Processando arquivo:', file.name);
          
          const { data: urlData } = supabase
            .storage
            .from('images')
            .getPublicUrl(`blog/${file.name}`);

          console.log('URL gerada para', file.name, ':', urlData?.publicUrl);

          return {
            name: file.name,
            url: urlData.publicUrl
          };
        })
      );

      console.log('URLs processadas:', imageUrls);
      setImages(imageUrls);

    } catch (error) {
      console.error('Erro detalhado ao carregar imagens:', error);
      alert('Erro ao carregar imagens do storage');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    const toastId = toast.loading('Excluindo imagem...');

    try {
      setLoading(true);
      console.log('=== INÍCIO DO PROCESSO DE EXCLUSÃO ===');
      console.log('1. Imagem a ser excluída:', imageName);

      // Verificar se a imagem está em uso
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, title')
        .or(`image_url.ilike.%${imageName},additional_images.cs.{${imageName}}`);

      if (posts && posts.length > 0) {
        throw new Error('Esta imagem está sendo usada em um ou mais posts e não pode ser excluída');
      }

      // Tentar excluir a imagem
      const { data, error } = await supabase
        .storage
        .from('images')
        .remove([`blog/${imageName}`]);

      console.log('2. Resultado da exclusão:', { data, error });

      if (error) {
        console.error('Erro detalhado:', error);
        throw error;
      }

      // Forçar atualização da lista
      const { data: updatedFiles } = await supabase
        .storage
        .from('images')
        .list('blog');

      console.log('3. Lista atualizada:', updatedFiles);

      // Atualizar interface com nova lista
      const newImageUrls = await Promise.all(
        (updatedFiles || []).map(async (file) => {
          const { data } = supabase
            .storage
            .from('images')
            .getPublicUrl(`blog/${file.name}`);

          return {
            name: file.name,
            url: data.publicUrl
          };
        })
      );

      setImages(newImageUrls);
      console.log('4. Interface atualizada com', newImageUrls.length, 'imagens');
      console.log('=== EXCLUSÃO CONCLUÍDA COM SUCESSO ===');

      // Atualizar o toast para sucesso
      toast.success('Imagem excluída com sucesso!', { id: toastId });

    } catch (error: any) {
      console.error('ERRO NA EXCLUSÃO:', error);
      // Atualizar o toast para erro
      toast.error(`Erro: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageImages();
  }, []);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl text-amber-400">Imagens no Storage</h2>
        <button
          onClick={fetchStorageImages}
          disabled={loading}
          className="text-purple-400 hover:text-purple-300"
        >
          Atualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 border-2 border-purple-500 border-t-transparent rounded-full" />
          <p className="text-gray-400">Carregando imagens...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.name}
              className="group relative aspect-square bg-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setConfirmModal({ isOpen: true, imageName: image.name })}
                  className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition-colors"
                  title="Excluir imagem"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">
          Nenhuma imagem encontrada no storage
        </p>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, imageName: '' })}
        onConfirm={() => handleDeleteImage(confirmModal.imageName)}
        imageName={confirmModal.imageName}
      />
    </div>
  );
} 