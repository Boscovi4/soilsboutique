import React from 'react';
import { Product } from '../types';
import { ProductActions } from './ProductActions';

interface FeaturedProductProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isInCart: boolean;
  onAddToCart: () => void;
}

export const FeaturedProduct: React.FC<FeaturedProductProps> = ({ 
  product, 
  isAdmin, 
  onEdit,
  onDelete,
  isInCart,
  onAddToCart
}) => {
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
          <div className="flex flex-col gap-2 mt-auto">
            <span className="text-primary font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
            <ProductActions 
              productName={product.name} 
              fullWidth={true} 
              isInCart={isInCart}
              onAddToCart={onAddToCart}
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
              if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone and the product will be permanently removed from the store.`)) {
                onDelete?.(product.id);
              }
            }}
            className="bg-red-600 text-white px-1.5 py-1.5 rounded-full hover:bg-red-700 transition-colors shadow-xl backdrop-blur-md border border-white/20 flex items-center gap-1"
            title="Bye Me (Delete Product)"
          >
            <span className="material-icons text-sm">delete</span>
            <span className="text-[10px] font-bold uppercase">Bye Me</span>
          </button>
        </div>
      )}
    </div>
  );
};