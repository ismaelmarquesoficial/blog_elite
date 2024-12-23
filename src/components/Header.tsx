import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useCategory } from '../contexts/CategoryContext';
import { useCategories } from '../hooks/useCategories';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const { categories, selectedCategory, setSelectedCategory, loading } = useCategory();
  const { posts } = useBlogPosts();
  const { categories: allCategories, loading: categoriesLoading } = useCategories();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Blog', path: '/' },
    { name: 'Galeria de Inauguração', path: '/galeria' },
    { name: 'Eventos', path: '/eventos' }
  ];

  return (
    <header className="sticky top-0 z-10 backdrop-blur-lg bg-gray-900/80 border-b border-purple-900/20">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img 
                src="public/logo.png" 
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          <div className="hidden md:flex relative">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'w-72' : 'w-48'}`}>
              <input
                type="text"
                placeholder="Search photos..."
                className="w-full bg-gray-800/50 text-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors relative group
                  ${location.pathname === item.path 
                    ? 'text-amber-400' 
                    : 'text-gray-400 hover:text-amber-400'
                  }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all
                  ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                />
              </Link>
            ))}

            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  toast.success('Logout realizado com sucesso!');
                }}
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                Sair
              </button>
            )}
          </nav>
        </div>
      </div>

      {location.pathname === '/' && (
        <div className="border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-3 overflow-x-auto">
              <div className="flex space-x-4 min-w-max">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`
                    px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors
                    ${!selectedCategory
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                    }
                  `}
                >
                  Todos
                </button>

                {allCategories?.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`
                      px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors
                      ${selectedCategory === category.name
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}