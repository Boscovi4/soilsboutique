import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface ProductVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  actionType: 'cart' | 'whatsapp' | null;
  onConfirm: (product: Product, size?: string, color?: string) => void;
}

export const ProductVariantModal: React.FC<ProductVariantModalProps> = ({
  isOpen,
  onClose,
  product,
  actionType,
  onConfirm
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Parse colors from comma-separated string
  const availableColors = product?.color 
    ? product.color.split(',').map(c => c.trim()).filter(c => c.length > 0)
    : [];

  const images = product 
    ? (product.images && product.images.length > 0 ? product.images : [product.imageUrl])
    : [];

  // Reset state when product opens
  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize('');
      setCurrentImageIndex(0);
      // If only one color, auto-select it
      if (availableColors.length === 1) {
        setSelectedColor(availableColors[0]);
      } else {
        setSelectedColor('');
      }
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColorChoice = availableColors.length > 0;

  const handleConfirm = () => {
    if (hasSizes && !selectedSize) {
      alert('Please select a size');
      return;
    }
    if (hasColorChoice && availableColors.length > 1 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    // Determine final color (either selected, or the single available one)
    const finalColor = selectedColor || (availableColors.length === 1 ? availableColors[0] : undefined);

    if (actionType === 'whatsapp') {
      const sizeText = selectedSize ? ` | Size: ${selectedSize}` : '';
      const colorText = finalColor ? ` | Color: ${finalColor}` : '';
      
      const text = `Olá, ha'u interese ho ${product.name}${sizeText}${colorText}. Sei iha ka lae?`;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
      const url = `${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      onClose();
    } else {
      onConfirm(product, selectedSize, finalColor);
      onClose();
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white truncate pr-4">{product.name}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
            <span className="material-icons text-gray-500">close</span>
          </button>
        </div>
        
        <div className="overflow-y-auto">
          {/* Image Gallery */}
          <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <img 
              src={images[currentImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-contain p-4" 
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-1.5 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                >
                  <span className="material-icons text-lg">chevron_left</span>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 p-1.5 rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                >
                  <span className="material-icons text-lg">chevron_right</span>
                </button>
                
                {/* Dots */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {images.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? 'bg-primary w-3' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4">
            <div className="mb-4">
               <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
               {product.description && <p className="text-sm text-gray-500 mt-1">{product.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              {hasSizes && (
                <div className={!hasColorChoice ? "col-span-2" : "col-span-1"}>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[2.5rem] px-2 py-1.5 rounded-md text-xs font-medium border transition-all ${
                          selectedSize === size
                            ? 'bg-secondary text-white border-secondary ring-1 ring-offset-1 ring-secondary'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasColorChoice && (
                <div className={!hasSizes ? "col-span-2" : "col-span-1"}>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Color</label>
                  {availableColors.length === 1 ? (
                     <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-700">
                        {availableColors[0]}
                     </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-2 py-1.5 rounded-md text-xs font-medium border transition-all ${
                            selectedColor === color
                              ? 'bg-secondary text-white border-secondary ring-1 ring-offset-1 ring-secondary'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 mt-auto">
          <button
            onClick={handleConfirm}
            className={`w-full py-3 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
               actionType === 'whatsapp' 
               ? 'bg-green-600 hover:bg-green-700' 
               : 'bg-primary hover:bg-opacity-90'
            }`}
          >
            {actionType === 'whatsapp' ? (
              <>
                <span>Hola Agora</span>
                <span className="material-icons text-sm">whatsapp</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                <span className="material-icons text-sm">shopping_cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};