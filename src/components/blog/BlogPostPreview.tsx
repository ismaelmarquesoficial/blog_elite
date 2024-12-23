import { BlogPost } from '../../hooks/useBlogPosts';
import { useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BlogPostPreviewProps {
  post: BlogPost;
  onDelete: (id: number) => Promise<void>;
  onEdit: (post: BlogPost) => void;
}

export function BlogPostPreview({ post, onDelete, onEdit }: BlogPostPreviewProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    try {
      setIsDeleting(true);
      await onDelete(post.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-700/30 rounded-lg overflow-hidden group">
      <div className="aspect-video relative">
        <img 
          src={post.image_url} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(post)}
            className="p-2 bg-amber-500/80 rounded-lg text-white hover:bg-amber-600 transition-colors flex items-center gap-2"
            disabled={isDeleting}
          >
            <Pencil size={16} />
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-600 transition-colors flex items-center gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Excluir</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-white">{post.title}</h3>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
            {post.category?.name}
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-2">{new Date(post.date).toLocaleDateString()}</p>
        <p className="text-gray-300 text-sm line-clamp-2">{post.content}</p>
      </div>
    </div>
  );
} 