/**
 * 🎯 Simple Hero Section
 * Hero limpio y directo para blog de noticias tech
 */

import React from 'react';
import { Search } from 'lucide-react';

interface SimpleHeroSectionProps {
  totalPosts?: number;
  onSearch?: () => void;
}

export const SimpleHeroSection: React.FC<SimpleHeroSectionProps> = ({
  totalPosts = 0,
  onSearch
}) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Título Simple */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Blog <span className="text-yellow-300">Tech</span>
          </h1>

          {/* Subtítulo Simple */}
          <p className="text-lg text-blue-100 mb-8">
            Las últimas noticias y tendencias tecnológicas
          </p>

          {/* Stats Simple */}
          <div className="flex justify-center gap-8 mb-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalPosts}+</div>
              <div className="text-blue-200">Artículos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">15K+</div>
              <div className="text-blue-200">Lectores</div>
            </div>
          </div>

          {/* Search Bar Simple */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                className="w-full pl-12 pr-24 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
                onFocus={onSearch}
              />
              <button 
                className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                onClick={onSearch}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};