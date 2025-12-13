import React from 'react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (id: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem
}) => {
  if (!isOpen) return null;

  const handleBuyItem = (productName: string) => {
    const text = `Olá, ha'u interese ho ${productName}. Sei iha ka lae?`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
    const url = `${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

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
                    Your Cart
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
                        <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center justify-center shrink-0">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                                    <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button 
                                        onClick={() => handleBuyItem(item.name)}
                                        className="flex-1 bg-green-600 text-white py-1.5 px-3 rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-1 hover:bg-green-700 transition-colors"
                                    >
                                        <span>Hola Agora</span>
                                        <span className="material-icons text-[14px]">whatsapp</span>
                                    </button>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
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
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-card-dark">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 dark:text-gray-400">Total</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};