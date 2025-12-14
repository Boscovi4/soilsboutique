import React from 'react';

interface NavBarProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
  cartCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  isAdmin, 
  onToggleAdmin, 
  cartCount, 
  onCartClick,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-50 bg-card-light dark:bg-card-dark shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 py-3 flex items-center justify-between">
        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-icons text-gray-600 dark:text-gray-300">menu</span>
        </button>
        <h1 className="text-2xl font-brand font-bold tracking-widest uppercase">
          <span className="text-secondary dark:text-white">SOILS</span>
          <span className="text-primary ml-1.5">BOUTIQUE</span>
        </h1>
        <div className="flex items-center space-x-3">
          {/* Admin/Profile Quick Link */}
          <button 
            onClick={onToggleAdmin}
            className={`p-1.5 rounded-full transition-all ${isAdmin ? 'bg-secondary text-white' : 'text-gray-400 hover:bg-gray-100'}`}
            title={isAdmin ? "Go to Profile (Admin)" : "Login"}
          >
            <span className="material-icons text-sm">{isAdmin ? 'manage_accounts' : 'person_outline'}</span>
          </button>

          <button 
            onClick={onCartClick}
            className="relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-icons text-gray-600 dark:text-gray-300">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-gray-400 text-sm">search</span>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search for sustainable items..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};