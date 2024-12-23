import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { BlogPost } from '../../hooks/useBlogPosts';
import { supabase } from '../../lib/supabase';
import { useCategories } from '../../hooks/useCategories';

interface EditPostModalProps {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => Promise<void>;
}

export function EditPostModal({ post, isOpen, onClose, onUpdate }: EditPostModalProps) {
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();
  const [form, setForm] = useState({
    title: '',
    content: '',
    date: '',
    category_id: 0,
    images: [] as File[],
    imageUrls: [] as string[],
    existingImages: [] as string[]
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        content: post.content,
        date: post.date,
        category_id: post.category_id,
        images: [],
        imageUrls: [],
        existingImages: [post.image_url, ...(post.additional_images || [])]
      });
    }
  }, [post]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...files],
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload das imagens');
    }
  };

  const ImagePreview = () => (
    <div className="space-y-4">
      {form.existingImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Imagens Existentes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {form.existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      existingImages: prev.existingImages.filter((_, i) => i !== index)
                    }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {form.imageUrls.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Novas Imagens</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {form.imageUrls.map((url, index) => (
              <div key={`new-${index}`} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`New ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
                    }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Primeiro: remover o post existente
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (deleteError) throw deleteError;

      // Usar a primeira imagem existente ou nova como principal
      const mainImageUrl = form.existingImages[0] || form.imageUrls[0];
      
      // Combinar imagens existentes e novas (exceto a principal)
      const additionalImages = [
        ...form.existingImages.slice(1),
        ...form.imageUrls
      ];

      // Segundo: inserir o post atualizado
      const { data, error: insertError } = await supabase
        .from('blog_posts')
        .insert([{
          id: post.id,
          title: form.title,
          content: form.content,
          date: form.date,
          category_id: form.category_id,
          image_url: mainImageUrl,
          additional_images: additionalImages
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      await onUpdate();
      onClose();
      alert('Post atualizado com sucesso!');

    } catch (error: any) {
      console.error('Erro na operação:', error);
      alert('Erro ao atualizar post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-amber-400">Editar Post</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => {
                console.log('Título alterado para:', e.target.value);
                setForm(prev => ({ ...prev, title: e.target.value }));
              }}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Conteúdo
            </label>
            <textarea
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={form.category_id}
              onChange={e => setForm(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagens
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300">
                    <span>Upload de imagens</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
              </div>
            </div>
          </div>

          <ImagePreview />

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors mr-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg transition-all
                ${loading 
                  ? 'bg-purple-500/50 cursor-not-allowed' 
                  : 'bg-purple-500 hover:bg-purple-600'
                }
                text-white font-medium
              `}
            >
              {loading ? 'Atualizando...' : 'Atualizar Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 