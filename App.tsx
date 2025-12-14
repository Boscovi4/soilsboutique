import React, { useState, useEffect } from 'react';
import { NavBar } from './components/NavBar';
import { HeroSection } from './components/HeroSection';
import { CategoryRail } from './components/CategoryRail';
import { FeaturedProduct } from './components/FeaturedProduct';
import { GridProduct } from './components/GridProduct';
import { BottomNav } from './components/BottomNav';
import { EditProductModal } from './components/EditProductModal';
import { CartModal } from './components/CartModal';
import { WishlistModal } from './components/WishlistModal';
import { LoginModal } from './components/LoginModal';
import { ProductVariantModal } from './components/ProductVariantModal';
import { BulkUploadModal } from './components/BulkUploadModal';
import { Toast } from './components/Toast';
import { PRODUCTS, WHATSAPP_NUMBER, CATEGORIES } from './constants';
import { Product } from './types';

const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  // Initialize from LocalStorage or constants
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('soils-products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse products", e);
        return PRODUCTS;
      }
    }
    return PRODUCTS;
  });

  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // App State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  // Selected Product State
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [variantAction, setVariantAction] = useState<'cart' | 'whatsapp' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Persist products
  useEffect(() => {
    localStorage.setItem('soils-products', JSON.stringify(products));
  }, [products]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // --- Filtering Logic ---
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || 
                            (activeCategory === 'mens' && p.name.toLowerCase().includes('men')) || // Simple keyword matching for demo
                            (activeCategory === 'womens' && p.name.toLowerCase().includes('women')) ||
                            (activeCategory === 'accessories' && p.name.toLowerCase().includes('hat') || p.name.toLowerCase().includes('bag')); // Keyword matching
                            // In a real app, Product would have a 'categoryId' field.

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = filteredProducts.filter(p => p.type === 'featured');
  const allGridProducts = filteredProducts.filter(p => p.type === 'grid');

  // --- Pagination Logic ---
  const totalPages = Math.ceil(allGridProducts.length / ITEMS_PER_PAGE);
  const currentGridProducts = allGridProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const gridSection = document.getElementById('product-grid-section');
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Product Management (Admin) ---
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === product.id);
      if (index >= 0) {
        const newProducts = [...prev];
        newProducts[index] = product;
        showToast('Product updated successfully');
        return newProducts;
      } else {
        showToast('New product added successfully');
        return [product, ...prev];
      }
    });
  };

  const handleBulkUpload = (newProducts: Product[]) => {
    setProducts(prev => [...newProducts, ...prev]);
    showToast(`Successfully added ${newProducts.length} products!`);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(p => p.id !== id));
    if (editingProduct?.id === id) {
      setIsModalOpen(false);
      setEditingProduct(null);
    }
    showToast('Product deleted', 'info');
  };

  // --- Cart & Actions ---
  const handleProductAction = (type: 'whatsapp' | 'cart', product: Product) => {
    const hasVariants = (product.sizes && product.sizes.length > 0) || (product.color && product.color.split(',').length > 1);
    
    if (hasVariants) {
      setVariantProduct(product);
      setVariantAction(type);
      setVariantModalOpen(true);
    } else {
      if (type === 'whatsapp') {
        const text = `Olá, ha'u interese ho ${product.name}${product.color ? ` (${product.color})` : ''}. Sei iha ka lae?`;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
        const url = `${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      } else {
        addToCartInternal(product);
      }
    }
  };

  const addToCartInternal = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const cartItemId = `${product.id}-${size || 'def'}-${color || 'def'}`;
      const existingItem = prev.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        showToast(`Updated ${product.name} quantity`);
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        showToast(`Added ${product.name} to cart`);
        const newCartItem = {
          ...product,
          selectedSize: size,
          selectedColor: color,
          cartItemId: cartItemId,
          quantity: 1
        };
        return [...prev, newCartItem];
      }
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQuantity = Math.max(1, (item.quantity || 1) + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(p => (p.cartItemId || p.id) !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  // --- Wishlist Logic ---
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast('Added to wishlist');
        return [...prev, product];
      }
    });
  };

  const handleMoveToCart = (product: Product) => {
    handleToggleWishlist(product); // Remove from wishlist
    handleProductAction('cart', product);
  };

  // --- Navigation Handlers ---
  const handleHomeClick = () => {
    setSearchQuery('');
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Admin Auth ---
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      showToast('Exited Admin Mode', 'info');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLogin = (u: string, p: string) => {
    if (u === 'Fanya' && p === '1234') {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      showToast('Welcome back, Admin!');
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen pb-24 w-full mx-auto bg-white dark:bg-background-dark relative">
      <NavBar 
        isAdmin={isAdmin} 
        onToggleAdmin={handleToggleAdmin} 
        cartCount={cart.reduce((acc, item) => acc + (item.quantity || 1), 0)}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main>
        <HeroSection products={products} onAction={handleProductAction} />
        
        <div id="shop-section" className="max-w-[1920px] mx-auto">
          <CategoryRail activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

          {/* Admin Add Button */}
          {isAdmin && (
            <div className="px-4 mb-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
               <button 
                onClick={handleAddProduct}
                className="bg-secondary text-white border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-opacity-90 transition-colors shadow-lg"
               >
                 <span className="material-icons text-3xl">add_circle_outline</span>
                 <span className="font-semibold text-sm">Add Single Product</span>
               </button>
               <button 
                onClick={() => setIsBulkModalOpen(true)}
                className="bg-primary text-white border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-opacity-90 transition-colors shadow-lg"
               >
                 <span className="material-icons text-3xl">playlist_add</span>
                 <span className="font-semibold text-sm">Bulk Upload (CSV)</span>
               </button>
            </div>
          )}
          
          {/* Empty State */}
          {filteredProducts.length === 0 && (
             <div className="px-4 py-16 text-center text-gray-500 min-h-[50vh] flex flex-col items-center justify-center">
                <span className="material-icons text-6xl mb-4 text-gray-200">checkroom</span>
                <p className="text-lg font-medium">No products found matching "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mb-4">Try checking your spelling or using different keywords</p>
                <button onClick={handleHomeClick} className="text-primary mt-2 font-bold px-6 py-2 border border-primary rounded-full hover:bg-primary hover:text-white transition-colors">Clear Filters</button>
             </div>
          )}

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="px-4 mb-8">
              <h3 className="text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                <span className="material-icons text-yellow-500">local_fire_department</span>
                Featured Collections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <FeaturedProduct 
                    key={product.id} 
                    product={product} 
                    isAdmin={isAdmin}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    isInCart={cart.some(p => p.id === product.id)}
                    onAction={handleProductAction}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Main Product Grid */}
          <div className="px-4" id="product-grid-section">
            {allGridProducts.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {activeCategory === 'all' ? 'New Arrivals' : `${CATEGORIES.find(c => c.id === activeCategory)?.name} Collection`}
                </h3>
                <span className="text-xs text-gray-400">{allGridProducts.length} items</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
              {currentGridProducts.map(product => (
                <GridProduct 
                  key={product.id} 
                  product={product} 
                  isAdmin={isAdmin}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  isInCart={cart.some(p => p.id === product.id)}
                  onAction={handleProductAction}
                  isWishlisted={wishlist.some(p => p.id === product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {allGridProducts.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-12 mb-8">
                <nav className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'}`}
                    aria-label="Previous Page"
                  >
                    <span className="material-icons">chevron_left</span>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-secondary text-white shadow-md'
                          : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'}`}
                    aria-label="Next Page"
                  >
                    <span className="material-icons">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BottomNav 
        onHomeClick={handleHomeClick}
        onSearchClick={handleSearchClick}
        onWishlistClick={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
      />
      
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <EditProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
      
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onUpload={handleBulkUpload}
      />

      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
      />

      <WishlistModal 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveItem={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
        onMoveToCart={handleMoveToCart}
      />

      <ProductVariantModal
        isOpen={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        product={variantProduct}
        actionType={variantAction}
        onConfirm={addToCartInternal}
      />

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;