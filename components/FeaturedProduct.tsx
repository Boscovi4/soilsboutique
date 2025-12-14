import React from 'react';
import { Product } from '../types';
import { ProductActions } from './ProductActions';

interface FeaturedProductProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isInCart: boolean;
  onAction: (type: 'whatsapp' | 'cart', product: Product) => void;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({ 
  product, 
  isAdmin, 
  onEdit,
  onDelete,
  isInCart,
  onAction
}) => {
  const colors = product.color ? product.color.split(',').map(c => c.trim()).filter(c => c) : [];

  return (
    <div className="relative group h-full">
      <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-row h-full relative z-0 ${isAdmin ? 'ring-2 ring-dashed ring-gray-300' : ''}`}>
        <div className="w-1/3 bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center relative">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <img
            alt={product.name}
            className="max-h-32 md:max-h-40 object-contain mix-blend-multiply dark:mix-blend-normal z-10"
            src={product.imageUrl}
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* Available Variants Display */}
          <div className="flex flex-col gap-1.5 mb-3">
            {product.sizes && product.sizes.length > 0 && (
               <div className="flex flex-wrap gap-1">
                  {product.sizes.slice(0, 4).map(size => (
                     <span key={size} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600">
                       {size}
                     </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="text-[10px] text-gray-400 self-center">+{product.sizes.length - 4}</span>
                  )}
               </div>
            )}
            {colors.length > 0 && (
               <div className="flex flex-wrap gap-1">
                  {colors.slice(0, 3).map(color => (
                     <span key={color} className="text-[10px] px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-500 dark:text-gray-400">
                        {color}
                     </span>
                  ))}
                   {colors.length > 3 && (
                    <span className="text-[10px] text-gray-400 self-center">+{colors.length - 3}</span>
                  )}
               </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-primary font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
            <ProductActions 
              product={product} 
              fullWidth={true} 
              isInCart={isInCart}
              onAction={onAction}
            />
          </div>
        </div>
      </div>

      {/* Admin Controls - Placed last to ensure top stacking order */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-50 flex gap-2">
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