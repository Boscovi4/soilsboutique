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
  images: string[];
  type: 'featured' | 'grid';
  rating: number;
  isHot: boolean;
  sizes: string[];
  color: string;
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

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
    images: [],
    type: 'grid',
    rating: 5,
    isHot: false,
    sizes: [],
    color: ''
  });

  useEffect(() => {
    if (product) {
      // Ensure images array is populated, falling back to imageUrl if images is empty/undefined
      const initialImages = product.images && product.images.length > 0 
        ? product.images 
        : (product.imageUrl ? [product.imageUrl] : []);

      setFormData({
        name: product.name,
        price: product.price.toString(),
        description: product.description || '',
        imageUrl: product.imageUrl,
        images: initialImages,
        type: product.type,
        rating: product.rating || 5,
        isHot: product.isHot || false,
        sizes: product.sizes || [],
        color: product.color || ''
      });
    } else {
      setFormData({
        name: '',
        price: '', // Start empty for new products
        description: '',
        imageUrl: '',
        images: [],
        type: 'grid',
        rating: 5,
        isHot: false,
        sizes: [],
        color: ''
      });
    }
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      Promise.all(fileArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file as Blob);
        });
      })).then(newImages => {
        setFormData(prev => {
          const updatedImages = [...prev.images, ...newImages];
          return {
            ...prev,
            images: updatedImages,
            // If no main image set, set the first of the new batch
            imageUrl: prev.imageUrl || updatedImages[0]
          };
        });
      }).catch(err => console.error("Error reading files", err));
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        // Update main imageUrl if we removed the first one
        imageUrl: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const setMainImage = (index: number) => {
    setFormData(prev => {
      const newMain = prev.images[index];
      // Move new main to front of array? Or just set imageUrl?
      // Let's just set imageUrl for now, but keeping order is nice.
      // Strategy: Reorder array so selected is first.
      const newImages = [...prev.images];
      const [selected] = newImages.splice(index, 1);
      newImages.unshift(selected);
      
      return {
        ...prev,
        images: newImages,
        imageUrl: selected
      };
    });
  };

  const toggleSize = (size: string) => {
    setFormData(prev => {
      const currentSizes = prev.sizes;
      if (currentSizes.includes(size)) {
        return { ...prev, sizes: currentSizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...currentSizes, size] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(formData.price);

    // Require at least one image
    const finalImageUrl = formData.images.length > 0 ? formData.images[0] : formData.imageUrl;

    if (!formData.name || !formData.price || isNaN(priceValue) || !finalImageUrl) {
      alert("Please fill in required fields (Name, Price, Image)");
      return;
    }
    
    onSave({
      id: product?.id || Date.now().toString(),
      name: formData.name,
      price: priceValue,
      description: formData.description || undefined,
      imageUrl: finalImageUrl,
      images: formData.images,
      type: formData.type,
      rating: formData.rating,
      isHot: formData.isHot,
      sizes: formData.sizes,
      color: formData.color
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
          {/* Image Upload Gallery */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Images</label>
            
            {/* Main Preview / Upload Box */}
            <div className="relative h-48 w-full rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden group">
              {formData.images.length > 0 ? (
                <img src={formData.images[0]} alt="Main Preview" className="h-full w-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <span className="material-icons text-3xl">add_photo_alternate</span>
                  <p className="text-xs">Upload Images</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                <span className="font-medium flex items-center gap-1">
                  <span className="material-icons text-sm">add</span> Add Photos
                </span>
              </div>
            </div>

            {/* Thumbnails Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx}`} 
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                      onClick={() => setMainImage(idx)}
                    />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-icons text-[10px] block">close</span>
                    </button>
                    {idx === 0 && (
                       <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 font-bold">
                         MAIN
                       </div>
                    )}
                  </div>
                ))}
                {/* Small add button in grid */}
                 <div className="relative aspect-square rounded-md border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <span className="material-icons text-gray-400">add</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                 </div>
              </div>
            )}
             <p className="text-[10px] text-gray-500">First image is the main cover. Click a thumbnail to make it main.</p>
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

          {/* Color & Display Type */}
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g. Navy Blue"
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white text-gray-900 text-sm"
              />
            </div>
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
          </div>

          {/* Sizes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'
                  }`}
                >
                  {size}
                </button>
              ))}
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
          <div className="flex justify-between items-center pt-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 block mb-1">Rating</label>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isHot"
                checked={formData.isHot}
                onChange={e => setFormData({ ...formData, isHot: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300"
              />
              <label htmlFor="isHot" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">Mark as HOT</label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            {product && (
              <button
                type="button"
                onClick={() => {
                  if(window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
                    onDelete(product.id);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded font-medium text-sm hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-icons text-sm">delete</span>
                Delete Product
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