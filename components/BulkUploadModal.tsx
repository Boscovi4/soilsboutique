import React, { useState } from 'react';
import { Product } from '../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (products: Product[]) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [csvContent, setCsvContent] = useState('');
  const [error, setError] = useState('');

  const handleProcess = () => {
    setError('');
    if (!csvContent.trim()) {
      setError('Please enter CSV content');
      return;
    }

    try {
      const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
      const newProducts: Product[] = [];
      let successCount = 0;

      // Skip header if present (heuristic: check if first line has "price" or "name")
      const startIndex = lines[0].toLowerCase().includes('price') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        // Simple CSV parser: splits by comma, assumes no commas in values for simplicity
        // Format: Name, Price, ImageUrl, Description, Type(grid/featured)
        const cols = lines[i].split(',').map(c => c.trim());
        
        if (cols.length < 3) continue; // Need at least Name, Price, Image

        const price = parseFloat(cols[1]);
        if (isNaN(price)) continue;

        const product: Product = {
          id: `bulk-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          name: cols[0].replace(/^"|"$/g, ''), // Remove surrounding quotes
          price: price,
          imageUrl: cols[2].replace(/^"|"$/g, ''),
          description: cols[3] ? cols[3].replace(/^"|"$/g, '') : '',
          type: (cols[4]?.toLowerCase() === 'featured') ? 'featured' : 'grid',
          rating: 5,
          isHot: false,
          images: [], // Default to empty array, main image is in imageUrl
          sizes: ['S', 'M', 'L'], // Default sizes
          color: ''
        };
        
        // Ensure image URL is valid-ish
        if (product.imageUrl.length > 5) {
            newProducts.push(product);
            successCount++;
        }
      }

      if (successCount === 0) {
        setError('No valid products found. Check format: Name, Price, ImageURL');
        return;
      }

      onUpload(newProducts);
      setCsvContent('');
      onClose();
    } catch (e) {
      setError('Failed to parse CSV. Please check the format.');
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-icons text-primary">playlist_add</span>
            Bulk Upload Products
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-icons text-gray-500">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-200">
            <p className="font-bold mb-1">CSV Format (Comma Separated):</p>
            <code className="block bg-white dark:bg-black/20 p-2 rounded border border-blue-100 dark:border-blue-800 font-mono text-xs mb-2">
              Product Name, Price, Image URL, Description, Type
            </code>
            <p className="text-xs opacity-80">
              Example: <br/>
              Summer Dress, 45.00, https://example.com/image.jpg, Beautiful floral dress, grid<br/>
              Cool T-Shirt, 25.50, https://example.com/tee.jpg, Cotton blend tee, featured
            </p>
          </div>

          <textarea
            className="w-full h-64 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            placeholder={`Paste your CSV data here...
Summer Dress, 45.00, https://link-to-image.com/1.jpg
Denim Jacket, 89.99, https://link-to-image.com/2.jpg`}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
          />

          {error && (
            <div className="mt-3 text-red-500 text-sm flex items-center gap-1">
              <span className="material-icons text-sm">error_outline</span>
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleProcess}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            <span className="material-icons">upload</span>
            Import Products
          </button>
        </div>
      </div>
    </div>
  );
};