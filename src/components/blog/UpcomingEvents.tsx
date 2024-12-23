import { useBlogPosts } from '../../hooks/useBlogPosts';

export function UpcomingEvents() {
  const { posts, loading } = useBlogPosts();

  // Filtrar eventos futuros
  const today = new Date();
  const upcomingPosts = posts.filter(post => new Date(post.date) >= today);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-amber-400 mb-6">Próximos Eventos</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      ) : upcomingPosts.length > 0 ? (
        <div className="space-y-6">
          {upcomingPosts.map(post => (
            <div key={post.id} className="bg-gray-700/30 rounded-lg overflow-hidden group">
              <div className="aspect-video relative">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium mb-2">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{new Date(post.date).toLocaleDateString()}</p>
                <p className="text-gray-300 text-sm line-clamp-2">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">Nenhum evento próximo</p>
      )}
    </div>
  );
}