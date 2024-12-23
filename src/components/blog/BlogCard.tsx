import React from 'react';
import { Clock, MessageCircle, ArrowRight } from 'lucide-react';

interface BlogCardProps {
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
}

export function BlogCard({
  title,
  excerpt,
  author,
  date,
  commentCount,
  imageUrl,
  category,
}: BlogCardProps) {
  return (
    <article className="group bg-gray-800/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium bg-purple-500/90 text-white rounded-full">
            {category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">
          {title}
        </h2>
        <p className="text-gray-400 mb-4 line-clamp-2">{excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-8 h-8 rounded-full ring-2 ring-purple-500/20"
            />
            <div>
              <p className="text-sm font-medium text-white">{author.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {date}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {commentCount} comments
                </span>
              </div>
            </div>
          </div>

          <button className="p-2 rounded-full bg-yellow-500/10 text-yellow-400 transition-all duration-300 hover:bg-yellow-500/20 hover:scale-110">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}