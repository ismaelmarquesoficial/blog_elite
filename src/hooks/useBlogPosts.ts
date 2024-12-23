import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCategory } from '../contexts/CategoryContext';

export type PostCategory = 'Evento' | 'Premiação' | 'Festival' | 'Happy Hour' | 'Corporativo' | 'Workshop';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
  image_url: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
  created_at?: string;
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCategory } = useCategory();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:post_categories!blog_posts_category_id_fkey(id, name)
        `)
        .order('date', { ascending: false });

      if (selectedCategory) {
        query = query.eq('post_categories.name', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);

    } catch (err: any) {
      console.error('Erro ao carregar posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]); // Recarregar quando a categoria mudar

  return { posts, loading, error, refetch: fetchPosts };
} 