import { useState, useEffect } from 'react';
import { Upload, Image, Type, Calendar, Grid, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCategories } from '../hooks/useCategories';
import { BlogPostPreview } from '../components/blog/BlogPostPreview';
import { EditPostModal } from '../components/blog/EditPostModal';
import { ImageUpload } from '../components/ImageUpload';
import { StorageImagePreview } from '../components/StorageImagePreview';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/LoginForm';

interface PostForm {
  title: string;
  content: string;
  date: string;
  images: File[];
  imageUrls: string[];
  category_id: number;
}

interface GalleryImage {
  id: number;
  title: string;
  photographer: string;
  image_url: string;
  created_at?: string;
}

interface GalleryForm {
  title: string;
  photographer: string;
  images: File[];
  imageUrls: string[];
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  image_url: string;
  additional_images?: string[];
  category_id: number;
  created_at?: string;
}

function CategoryManager({ onAddCategory }: { onAddCategory: (name: string) => Promise<void> }) {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      setIsAdding(true);
      await onAddCategory(newCategory.trim());
      setNewCategory('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Plus className="inline-block w-4 h-4 mr-2" />
          Nova Categoria
        </label>
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          placeholder="Digite o nome da categoria..."
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isAdding || !newCategory.trim()}
        className={`
          px-4 py-2 rounded-lg transition-all whitespace-nowrap
          ${isAdding || !newCategory.trim()
            ? 'bg-purple-500/50 cursor-not-allowed'
            : 'bg-purple-500 hover:bg-purple-600'
          }
          text-white font-medium
        `}
      >
        {isAdding ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adicionando...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Plus size={16} />
            <span>Adicionar</span>
          </div>
        )}
      </button>
    </div>
  );
}

export function AdminPanel() {
  // 1. Hooks de autenticação
  const { isAuthenticated } = useAuth();

  // 2. Hooks de estado
  const [activeTab, setActiveTab] = useState<'posts' | 'gallery'>('posts');
  const [loading, setLoading] = useState(false);
  const [postForm, setPostForm] = useState<PostForm>({
    title: '',
    content: '',
    date: '',
    images: [] as File[],
    imageUrls: [] as string[],
    category_id: 0
  });
  const [galleryForm, setGalleryForm] = useState<GalleryForm>({
    title: '',
    photographer: '',
    images: [],
    imageUrls: []
  });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const { categories, loading: loadingCategories, addCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    imageUrl: '',
    index: -1
  });
  const [confirmGalleryDelete, setConfirmGalleryDelete] = useState({
    isOpen: false,
    id: 0,
    title: ''
  });

  // 3. useEffect - Agora antes da verificação de autenticação
  useEffect(() => {
    // Só executa se estiver autenticado
    if (!isAuthenticated) return;

    const loadData = async () => {
      if (activeTab === 'posts') {
        await fetchBlogPosts();
      } else {
        await fetchGalleryImages();
      }
    };

    loadData();
  }, [activeTab, isAuthenticated]);

  // 4. Funções do componente
  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      console.log('Carregando imagens existentes...'); // Debug

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Resposta da busca:', { data, error }); // Debug

      if (error) {
        console.error('Erro ao carregar:', error);
        throw error;
      }

      if (data) {
        console.log('Imagens carregadas:', data);
        setGalleryImages(data);
      }
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:post_categories!blog_posts_category_id_fkey(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setBlogPosts(data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const toastId = toast.loading('Fazendo upload das imagens...');

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

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

      setGalleryForm(prev => ({ 
        ...prev, 
        images: [...prev.images, ...files],
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));

      toast.success('Imagens carregadas com sucesso!', { id: toastId });

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(`Erro no upload: ${error.message}`, { id: toastId });
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!galleryForm.title || galleryForm.imageUrls.length === 0) {
      toast.error('Preencha o título e selecione pelo menos uma imagem');
      return;
    }

    const toastId = toast.loading('Salvando imagens na galeria...');
    
    try {
      setLoading(true);

      // Criar array de objetos para inserção
      const insertData = galleryForm.imageUrls.map(url => ({
        title: galleryForm.title,
        photographer: galleryForm.photographer || 'Equipe Elite',
        image_url: url
      }));

      // Inserir no banco
      const { error } = await supabase
        .from('gallery')
        .insert(insertData);

      if (error) throw error;

      // Limpar formulário
      setGalleryForm({
        title: '',
        photographer: '',
        images: [],
        imageUrls: []
      });

      // Recarregar imagens
      await fetchGalleryImages();
      
      toast.success('Imagens salvas com sucesso!', { id: toastId });

    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(`Erro ao salvar: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    const toastId = toast.loading('Excluindo imagem...');

    try {
      setLoading(true);

      // 1. Encontrar a imagem no array
      const imageToDelete = galleryImages.find(img => img.id === id);
      if (!imageToDelete) {
        throw new Error('Imagem não encontrada');
      }

      // 2. Extrair o nome do arquivo da URL
      const matches = imageToDelete.image_url.match(/\/images\/gallery\/([^?]+)/);
      if (!matches || !matches[1]) {
        throw new Error('URL da imagem inválida');
      }

      const filePath = `gallery/${matches[1]}`;
      console.log('Excluindo arquivo:', filePath);

      // 3. Primeiro excluir do banco
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // 4. Depois excluir do storage
      const { error: storageError } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (storageError) {
        console.error('Erro ao excluir do storage:', storageError);
        toast.error('Imagem removida da galeria, mas houve um erro ao excluir do storage', { id: toastId });
        return;
      }

      // 5. Atualizar estado local
      setGalleryImages(prev => prev.filter(img => img.id !== id));
      
      toast.success('Imagem excluída com sucesso!', { id: toastId });

    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      toast.error(`Erro ao excluir: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (files: File[]) => {
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

      setPostForm(prev => ({
        ...prev,
        images: [...prev.images, ...files],
        imageUrls: [...prev.imageUrls, ...uploadedUrls]
      }));

    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao fazer upload das imagens');
    }
  };

  const handleRemoveImage = (index: number) => {
    setPostForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      alert('Digite o nome da categoria');
      return;
    }

    try {
      await addCategory(newCategory.trim());
      setNewCategory('');
      alert('Categoria adicionada com sucesso!');
    } catch (error: any) {
      alert(`Erro ao adicionar categoria: ${error.message}`);
    }
  };

  const handleDeletePost = async (id: number) => {
    const toastId = toast.loading('Excluindo post...');

    try {
      setLoading(true);

      // 1. Encontrar o post para pegar as URLs das imagens
      const postToDelete = blogPosts.find(p => p.id === id);
      if (!postToDelete) throw new Error('Post não encontrado');

      // 2. Extrair os caminhos dos arquivos das URLs
      const imagePaths: string[] = [];

      // Adicionar imagem principal se existir
      if (postToDelete.image_url) {
        const mainImageMatch = postToDelete.image_url.match(/\/images\/blog\/([^?]+)/);
        if (mainImageMatch?.[1]) {
          imagePaths.push(`blog/${mainImageMatch[1]}`);
        }
      }

      // Adicionar imagens adicionais se existirem
      if (postToDelete.additional_images?.length) {
        postToDelete.additional_images.forEach(url => {
          const match = url.match(/\/images\/blog\/([^?]+)/);
          if (match?.[1]) {
            imagePaths.push(`blog/${match[1]}`);
          }
        });
      }

      console.log('Imagens a serem excluídas:', imagePaths);

      // 3. Primeiro excluir do banco
      const { error: dbError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // 4. Depois excluir as imagens do storage
      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove(imagePaths);

        if (storageError) {
          console.error('Erro ao excluir imagens:', storageError);
          toast.error('Post removido, mas houve um erro ao excluir as imagens', { id: toastId });
          return;
        }
      }

      // 5. Atualizar o estado local
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      
      toast.success('Post excluído com sucesso!', { id: toastId });

    } catch (error: any) {
      console.error('Erro ao excluir post:', error);
      toast.error(`Erro ao excluir post: ${error.message}`, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    console.log('Editando post:', post);
    setEditingPost(post);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postForm.title || !postForm.content || !postForm.date || postForm.imageUrls.length === 0) {
      alert('Por favor, preencha todos os campos e adicione pelo menos uma imagem');
      return;
    }

    try {
      setLoading(true);

      // Usar a primeira imagem como principal
      const mainImageUrl = postForm.imageUrls[0];
      
      // Usar as imagens restantes como adicionais
      const additionalImages = postForm.imageUrls.slice(1);

      // Salvar post no banco com todas as imagens
      const { error: dbError } = await supabase
        .from('blog_posts')
        .insert({
          title: postForm.title,
          content: postForm.content,
          date: postForm.date,
          image_url: mainImageUrl,
          additional_images: additionalImages, // Armazenar as imagens adicionais
          category_id: postForm.category_id
        });

      if (dbError) throw dbError;

      // Limpar formulário
      setPostForm({
        title: '',
        content: '',
        date: '',
        images: [],
        imageUrls: [],
        category_id: 0
      });

      // Recarregar posts
      await fetchBlogPosts();
      alert('Post publicado com sucesso!');

    } catch (error: any) {
      console.error('Erro ao publicar post:', error);
      alert(`Erro ao publicar post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 5. Renderização condicional no retorno
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-purple-400 mb-8">Painel Administrativo</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'posts' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'gallery' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          Galeria
        </button>
      </div>

      {activeTab === 'posts' ? (
        // Seu formulário de posts existente...
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl text-amber-400 mb-6">Criar Novo Post</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Type className="inline-block w-4 h-4 mr-2" />
                Título
              </label>
              <input
                type="text"
                value={postForm.title}
                onChange={e => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Digite o título do post..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Data
              </label>
              <input
                type="date"
                value={postForm.date}
                onChange={e => setPostForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagens
              </label>
              <ImageUpload
                multiple
                onImageChange={handleImageChange}
                preview={postForm.imageUrls}
                onRemoveImage={handleRemoveImage}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Type className="inline-block w-4 h-4 mr-2" />
                Conteúdo
              </label>
              <textarea
                value={postForm.content}
                onChange={e => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Digite o conteúdo do post..."
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Type className="inline-block w-4 h-4 mr-2" />
                  Categoria
                </label>
                <select
                  value={postForm.category_id}
                  onChange={e => setPostForm(prev => ({ 
                    ...prev, 
                    category_id: parseInt(e.target.value) 
                  }))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <CategoryManager 
                  onAddCategory={async (name) => {
                    try {
                      await addCategory(name);
                      alert('Categoria adicionada com sucesso!');
                    } catch (error: any) {
                      alert(`Erro ao adicionar categoria: ${error.message}`);
                    }
                  }} 
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Categorias Existentes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map(cat => (
                  <div 
                    key={cat.id}
                    className="flex items-center justify-between bg-gray-700/30 rounded-lg px-3 py-2"
                  >
                    <span className="text-gray-200">{cat.name}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja remover a categoria "${cat.name}"?`)) {
                          deleteCategory(cat.id)
                            .then(() => alert('Categoria removida com sucesso!'))
                            .catch(error => alert(`Erro ao remover categoria: ${error.message}`));
                        }
                      }}
                      className="text-red-400 hover:text-red-500 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
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
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Publicar Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Nova seção de Galeria
        <div className="space-y-8">
          {/* Formulário para adicionar nova imagem */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl text-amber-400 mb-6">Adicionar Nova Imagem</h2>
            
            <form onSubmit={handleGallerySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Type className="inline-block w-4 h-4 mr-2" />
                  Título da Imagem
                </label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Digite o título da imagem..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Type className="inline-block w-4 h-4 mr-2" />
                  Fotógrafo
                </label>
                <input
                  type="text"
                  value={galleryForm.photographer}
                  onChange={e => setGalleryForm(prev => ({ ...prev, photographer: e.target.value }))}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Nome do fotógrafo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Image className="inline-block w-4 h-4 mr-2" />
                  Imagem
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300">
                        <span>Upload de arquivo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImageUpload}
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                  </div>
                </div>
              </div>

              {galleryForm.imageUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Preview das Imagens</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryForm.imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete({
                              isOpen: true,
                              imageUrl: url,
                              index: index
                            })}
                            className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
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
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Adicionar à Galeria</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Lista de imagens existentes */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl text-amber-400 mb-6">Imagens na Galeria</h2>
            
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <div 
                    key={image.id}
                    className="bg-gray-700/50 rounded-lg overflow-hidden group"
                  >
                    <div className="aspect-video relative">
                      <img 
                        src={image.image_url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setConfirmGalleryDelete({
                            isOpen: true,
                            id: image.id,
                            title: image.title
                          })}
                          className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                          disabled={loading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remover
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-medium">{image.title}</h3>
                      <p className="text-gray-400 text-sm">{image.photographer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl text-amber-400 mb-6">Posts Publicados</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-700/50 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <BlogPostPreview
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Nenhum post publicado ainda</p>
          )}
        </div>
      )}

      {activeTab === 'posts' && (
        <StorageImagePreview />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={async () => {
            await fetchBlogPosts();
            setEditingPost(null);
          }}
        />
      )}

      <ConfirmDeleteModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, imageUrl: '', index: -1 })}
        onConfirm={() => {
          setGalleryForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== confirmDelete.index),
            imageUrls: prev.imageUrls.filter((_, i) => i !== confirmDelete.index)
          }));
        }}
        title="Remover Imagem"
        message="A imagem será removida do formulário."
        itemName={`Preview ${confirmDelete.index + 1}`}
      />

      <ConfirmDeleteModal
        isOpen={confirmGalleryDelete.isOpen}
        onClose={() => setConfirmGalleryDelete({ isOpen: false, id: 0, title: '' })}
        onConfirm={() => handleDeleteImage(confirmGalleryDelete.id)}
        title="Excluir Imagem da Galeria"
        message="Esta imagem será removida permanentemente da galeria."
        itemName={confirmGalleryDelete.title}
      />
    </div>
  );
} 