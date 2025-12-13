import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

export const CategoryRail: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="px-4 py-6">
      <h3 className="text-lg font-semibold mb-3 px-1">Categories</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors shadow-sm ${
                isActive
                  ? 'bg-primary text-white'
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