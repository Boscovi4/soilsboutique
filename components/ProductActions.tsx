import React from 'react';
import { WHATSAPP_NUMBER } from '../constants';

interface ProductActionsProps {
  productName: string;
  className?: string;
  fullWidth?: boolean;
  isInCart: boolean;
  onAddToCart: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ 
  productName, 
  className = '', 
  fullWidth = false,
  isInCart,
  onAddToCart
}) => {
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    const text = `Olá, Ha'u interese ho ${productName}. Sei iha ka lae?`;
    
    // Check if it's a mobile device to use api.whatsapp.com vs web.whatsapp.com
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    
    const url = `${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  // Styles to match the provided reference image
  // - h-9: Comfortable touch target (36px)
  // - text-[10px] sm:text-xs: Readable but fits 2 buttons
  // - rounded: Matches the button radius in the image
  // - uppercase font-bold: Matches the typography
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