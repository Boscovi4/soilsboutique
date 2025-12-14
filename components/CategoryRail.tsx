import React from 'react';
import { CATEGORIES } from '../constants';

interface CategoryRailProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryRail: React.FC<CategoryRailProps> = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="px-4 py-6 sticky top-[60px] z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm transition-all">
      <h3 className="text-lg font-semibold mb-3 px-1">Categories</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-primary text-white scale-105'
                  : 'bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};