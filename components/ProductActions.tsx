import React from 'react';
import { Product } from '../types';

interface ProductActionsProps {
  product: Product;
  className?: string;
  fullWidth?: boolean;
  isInCart: boolean;
  onAction: (type: 'whatsapp' | 'cart', product: Product) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ 
  product, 
  className = '', 
  fullWidth = false,
  isInCart,
  onAction
}) => {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onAction('whatsapp', product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAction('cart', product);
  };

  const btnClasses = "h-9 px-1 rounded shadow-sm hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5 font-bold text-[10px] sm:text-xs uppercase w-full whitespace-nowrap overflow-hidden";

  if (isInCart) {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        <button
          onClick={handleWhatsApp}
          className={`bg-primary text-white ${btnClasses}`}
        >
          <span>Hola</span>
          <span className="material-icons text-xs sm:text-sm">lock</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className} ${fullWidth ? 'w-full' : ''}`}>
      <button
        onClick={handleWhatsApp}
        className={`bg-primary text-white ${btnClasses}`}
      >
        <span>Hola</span>
        <span className="material-icons text-xs sm:text-sm">lock</span>
      </button>
      <button
        onClick={handleAddToCartClick}
        className={`bg-secondary text-white ${btnClasses}`}
      >
        <span>Depois</span>
        <span className="material-icons text-xs sm:text-sm">add_shopping_cart</span>
      </button>
    </div>
  );
};