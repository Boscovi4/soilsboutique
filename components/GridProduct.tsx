import React from 'react';
import { Product } from '../types';
import { ProductActions } from './ProductActions';

interface GridProductProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isInCart: boolean;
  onAction: (type: 'whatsapp' | 'cart', product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const GridProduct: React.FC<GridProductProps> = ({ 
  product, 
  isAdmin, 
  onEdit,
  onDelete,
  isInCart,
  onAction,
  isWishlisted,
  onToggleWishlist
}) => {
  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="material-icons text-xs">star</span>);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<span key={i} className="material-icons text-xs">star_half</span>);
      } else {
        stars.push(<span key={i} className="material-icons text-xs text-gray-300">star_border</span>);
      }
    }
    return stars;
  };

  const colors = product.color ? product.color.split(',').map(c => c.trim()).filter(c => c) : [];

  return (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group flex flex-col h-full relative ${isAdmin ? 'ring-2 ring-dashed ring-gray-300' : ''}`}>
      <div className="relative bg-gray-50 dark:bg-gray-800 p-4 h-48 md:h-56 lg:h-64 flex items-center justify-center z-0">
        <img
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-105 transition-transform duration-300"
          src={product.imageUrl}
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-colors z-10 ${
            isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500'
          }`}
        >
          <span className="material-icons text-base">
            {isWishlisted ? 'favorite' : 'favorite_border'}
          </span>
        </button>
        {product.isHot && (
          <span className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
            HOT
          </span>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow relative z-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate" title={product.name}>
          {product.name}
        </h4>
        <div className="flex justify-between items-center mt-2 mb-3">
          <span className="text-primary font-bold">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex text-yellow-400 text-xs">
            {renderStars(product.rating)}
          </div>
        </div>

        {/* Available Variants Display */}
        <div className="flex flex-col gap-1.5 mb-3">
            {product.sizes && product.sizes.length > 0 && (
               <div className="flex flex-wrap gap-1">
                  {product.sizes.slice(0, 3).map(size => (
                     <span key={size} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600">
                       {size}
                     </span>
                  ))}
                  {product.sizes.length > 3 && (
                    <span className="text-[10px] text-gray-400 self-center">+{product.sizes.length - 3}</span>
                  )}
               </div>
            )}
            {colors.length > 0 && (
               <div className="flex flex-wrap gap-1">
                  {colors.slice(0, 2).map(color => (
                     <span key={color} className="text-[10px] px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-500 dark:text-gray-400 max-w-[60px] truncate" title={color}>
                        {color}
                     </span>
                  ))}
                   {colors.length > 2 && (
                    <span className="text-[10px] text-gray-400 self-center">+{colors.length - 2}</span>
                  )}
               </div>
            )}
        </div>

        <div className="mt-auto">
             <ProductActions 
               product={product} 
               fullWidth={true} 
               isInCart={isInCart}
               onAction={onAction}
             />
        </div>
      </div>

      {/* Admin Controls - Placed last to ensure top stacking order */}
      {isAdmin && (
        <div className="absolute top-2 left-2 z-50 flex flex-col gap-2">
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(product);
            }}
            className="bg-black/80 text-white px-3 py-1.5 rounded-full hover:bg-black transition-colors shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-1"
            title="Edit Product"
          >
            <span className="material-icons text-sm">edit</span>
            <span className="text-[10px] font-bold uppercase">Edit</span>
          </button>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                onDelete?.(product.id);
              }
            }}
            className="bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-1"
            title="Delete Product"
          >
            <span className="material-icons text-sm">delete</span>
            <span className="text-[10px] font-bold uppercase">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};