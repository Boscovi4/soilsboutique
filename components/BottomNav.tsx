import React from 'react';

interface BottomNavProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  wishlistCount: number;
  activeTab?: 'home' | 'profile';
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  onHomeClick, 
  onSearchClick, 
  onWishlistClick,
  onProfileClick,
  wishlistCount,
  activeTab = 'home'
}) => {
  const getBtnClass = (isActive: boolean) => 
    `flex flex-col items-center justify-center space-y-1 transition-colors w-12 ${
      isActive 
      ? 'text-primary dark:text-primary scale-105' 
      : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
      <div className="w-full mx-auto px-6 py-2 flex justify-between md:justify-center md:gap-20 items-center">
        <button 
          onClick={onHomeClick}
          className={getBtnClass(activeTab === 'home')}
        >
          <span className="material-icons text-2xl">home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button 
          onClick={onSearchClick}
          className={getBtnClass(false)}
        >
          <span className="material-icons text-2xl">search</span>
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <button 
          onClick={onWishlistClick}
          className={`relative ${getBtnClass(false)}`}
        >
          <span className="material-icons text-2xl">favorite</span>
          <span className="text-[10px] font-medium">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-card-dark"></span>
          )}
        </button>
        <button 
          onClick={onProfileClick}
          className={getBtnClass(activeTab === 'profile')}
        >
          <span className="material-icons text-2xl">person</span>
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};