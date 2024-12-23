import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../hooks/useCategories';

interface CategoryContextData {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  loading: boolean;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextData>({} as CategoryContextData);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Função para buscar categorias
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('post_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar categoria
  const addCategory = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('post_categories')
        .insert([{ name }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCategories(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      throw error;
    }
  };

  // Função para deletar categoria
  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('post_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  };

  // Carregar categorias quando o componente montar
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{
      categories,
      selectedCategory,
      setSelectedCategory,
      loading,
      addCategory,
      deleteCategory
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
} 