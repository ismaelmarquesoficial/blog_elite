import React from 'react';
import { Clock, MessageCircle, ArrowRight } from 'lucide-react';

interface FeaturedPostProps {
  post: {
    title: string;
    excerpt: string;
    author: {
      name: string;
      avatar: string;
    };
    date: string;
    commentCount: number;
    imageUrl: string;
    category: string;
  };
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="relative h-[500px] rounded-xl overflow-hidden group">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <span className="px-3 py-1 text-xs font-medium bg-purple-500/90 text-white rounded-full">
            {post.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
            {post.title}
          </h1>
          <p className="text-gray-300 mb-6 max-w-2xl">{post.excerpt}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full ring-2 ring-purple-500/20"
              />
              <div>
                <p className="font-medium text-white">{post.author.name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {post.commentCount} comments
                  </span>
                </div>
              </div>
            </div>

            <button className="px-6 py-3 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center gap-2 transition-all duration-300 hover:bg-yellow-500/30 hover:scale-105">
              Read More
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}