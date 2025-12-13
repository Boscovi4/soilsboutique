import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface EditProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

// Internal state uses string for price to improve input UX (avoids "0" sticking)
interface ProductFormState {
  name: string;
  price: string; 
  description: string;
  imageUrl: string;
  type: 'featured' | 'grid';
  rating: number;
  isHot: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<ProductFormState>({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    type: 'grid',
    rating: 5,
    isHot: false
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description || '',
        imageUrl: product.imageUrl,
        type: product.type,
        rating: product.rating || 5,
        isHot: product.isHot || false
      });
    } else {
      setFormData({
        name: '',
        price: '', // Start empty for new products
        description: '',
        imageUrl: '',
        type: 'grid',
        rating: 5,
        isHot: false
      });
    }
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(formData.price);

    if (!formData.name || !formData.price || isNaN(priceValue) || !formData.imageUrl) {
      alert("Please fill in required fields (Name, Price, Image)");
      return;
    }
    
    onSave({
      id: product?.id || Date.now().toString(),
      name: formData.name,
      price: priceValue,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl,
      type: formData.type,
      rating: formData.rating,
      isHot: formData.isHot
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-card-dark z-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="material-icons text-gray-500">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Image</label>
            <div className="relative h-48 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-white overflow-hidden group">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <span className="material-icons text-3xl">cloud_upload</span>
                  <p className="text-xs">Click to upload</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                Change Image
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white text-gray-900 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white text-gray-900 text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white text-gray-900 text-sm h-20"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Display Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as 'featured' | 'grid' })}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white text-gray-900 text-sm"
              >
                <option value="grid">Grid Item</option>
                <option value="featured">Featured Banner</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Rating</label>
              <div className="flex space-x-1 items-center h-9">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transform transition-transform active:scale-110"
                  >
                     <span className={`material-icons text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                       {star <= formData.rating ? 'star' : 'star_border'}
                     </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isHot"
              checked={formData.isHot}
              onChange={e => setFormData({ ...formData, isHot: e.target.checked })}
              className="rounded text-primary focus:ring-primary"
            />
            <label htmlFor="isHot" className="text-sm text-gray-700 dark:text-gray-300">Mark as HOT</label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            {product && (
              <button
                type="button"
                onClick={() => {
                  if(window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone and the product will be permanently removed from the store.`)) {
                    onDelete(product.id);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded font-medium text-sm hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-icons text-sm">delete</span>
                Hasai Agora
              </button>
            )}
            <button
              type="submit"
              className="flex-[2] bg-primary text-white py-2 rounded font-medium text-sm hover:bg-opacity-90 transition shadow-lg flex items-center justify-center gap-2"
            >
              <span className="material-icons text-sm">save</span>
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};