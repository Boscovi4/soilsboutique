import React from 'react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (cartItemId: string) => void;
  onUpdateQuantity: (cartItemId: string, change: number) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity
}) => {
  if (!isOpen) return null;

  const handleCheckout = () => {
    // Generate a summary message for all items
    const itemsList = cartItems.map((item, index) => {
      let details = '';
      if (item.selectedSize) details += ` [${item.selectedSize}]`;
      if (item.selectedColor) details += ` [${item.selectedColor}]`;
      return `${index + 1}. ${item.name}${details} x${item.quantity || 1} - $${((item.price) * (item.quantity || 1)).toFixed(2)}`;
    }).join('\n');

    const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const text = `*Ola Soils Boutique!* \nHa'u hakarak order items hirak ne'e:\n\n${itemsList}\n\n*Total: $${total.toFixed(2)}*\n\nSei iha stock ka?`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    const url = `${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={onClose} 
        />
        
        {/* Drawer */}
        <div className="relative w-full max-w-md h-full bg-white dark:bg-card-dark shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-card-dark z-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons">shopping_cart</span>
                    Your Cart ({cartItems.length})
                </h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span className="material-icons text-gray-500">close</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                        <span className="material-icons text-6xl text-gray-300">shopping_bag</span>
                        <p>Your cart is empty</p>
                        <button onClick={onClose} className="text-primary font-semibold hover:underline">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.cartItemId || item.id} className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center shrink-0">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                                    <div className="flex flex-wrap gap-2 my-1">
                                      {item.selectedSize && (
                                        <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                          Size: {item.selectedSize}
                                        </span>
                                      )}
                                      {item.selectedColor && (
                                        <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                          {item.selectedColor}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-1">
                                        <button 
                                          onClick={() => onUpdateQuantity(item.cartItemId!, -1)}
                                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary active:scale-90 transition-transform"
                                          disabled={(item.quantity || 1) <= 1}
                                        >
                                          -
                                        </button>
                                        <span className="text-sm font-bold w-4 text-center">{item.quantity || 1}</span>
                                        <button 
                                          onClick={() => onUpdateQuantity(item.cartItemId!, 1)}
                                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary active:scale-90 transition-transform"
                                        >
                                          +
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => onRemoveItem(item.cartItemId || item.id)}
                                        className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove"
                                    >
                                        <span className="material-icons text-lg">delete_outline</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                          <span className="text-gray-900 dark:text-white font-medium">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                          <span className="font-bold text-gray-900 dark:text-white">Total</span>
                          <span className="font-bold text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                        onClick={handleCheckout}
                        className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold uppercase flex items-center justify-center gap-2 hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-600/20"
                    >
                        <span>Checkout via WhatsApp</span>
                        <span className="material-icons text-sm">whatsapp</span>
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-2">
                      Secure checkout powered by WhatsApp
                    </p>
                </div>
            )}
        </div>
    </div>
  );
};