import { useBlogPosts } from '../../hooks/useBlogPosts';

export function PopularPosts() {
  const { posts, loading } = useBlogPosts();

  // Pegar os 3 posts mais recentes
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-amber-400 mb-6">Posts Recentes</h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      ) : recentPosts.length > 0 ? (
        <div className="space-y-4">
          {recentPosts.map(post => (
            <div key={post.id} className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors">
              <h3 className="text-white font-medium mb-2">{post.title}</h3>
              <p className="text-gray-400 text-sm">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">Nenhum post encontrado</p>
      )}
    </div>
  );
}