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
import { PRODUCTS } from './constants';
import { Product } from './types';

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
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist products whenever they change
  useEffect(() => {
    localStorage.setItem('soils-products', JSON.stringify(products));
  }, [products]);

  // Filter products based on search query
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate filtered products by type
  const featuredProducts = filteredProducts.filter(p => p.type === 'featured');
  const gridProducts = filteredProducts.filter(p => p.type === 'grid');

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
        // Update existing
        const newProducts = [...prev];
        newProducts[index] = product;
        return newProducts;
      } else {
        // Add new (put at top of grid or featured)
        return [product, ...prev];
      }
    });
  };

  const handleDeleteProduct = (id: string) => {
    // Remove from main products list
    setProducts(prev => prev.filter(p => p.id !== id));
    
    // Also remove from cart if present
    setCart(prev => prev.filter(p => p.id !== id));
    
    // Also remove from wishlist if present
    setWishlist(prev => prev.filter(p => p.id !== id));

    // If we are currently editing this product, close the modal
    if (editingProduct?.id === id) {
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!cart.some(p => p.id === product.id)) {
      setCart(prev => [...prev, product]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const isProductInCart = (id: string) => {
    return cart.some(p => p.id === id);
  };

  // Wishlist Logic
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isProductInWishlist = (id: string) => {
    return wishlist.some(p => p.id === id);
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product);
    handleToggleWishlist(product); // Remove from wishlist
  };

  // Bottom Nav Handlers
  const handleHomeClick = () => {
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    // Focus on search input
    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  // Admin Auth Logic
  const handleToggleAdmin = () => {
    if (isAdmin) {
      // Logout
      setIsAdmin(false);
    } else {
      // Open Login Modal
      setIsLoginModalOpen(true);
    }
  };

  const handleLogin = (u: string, p: string) => {
    // Hardcoded credentials for demonstration
    if (u === 'Fanya' && p === '1234') {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen pb-24 w-full md:max-w-3xl lg:max-w-7xl mx-auto bg-white dark:bg-background-dark shadow-2xl relative">
      <NavBar 
        isAdmin={isAdmin} 
        onToggleAdmin={handleToggleAdmin} 
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main>
        <HeroSection products={products} />
        
        <div id="shop-section">
          <CategoryRail />

          {/* Admin Add Button */}
          {isAdmin && (
            <div className="px-4 mb-6">
               <button 
                onClick={handleAddProduct}
                className="w-full bg-secondary text-white border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
               >
                 <span className="material-icons text-3xl">add_circle_outline</span>
                 <span className="font-semibold">Add New Product</span>
               </button>
            </div>
          )}
          
          {/* No Results Message */}
          {searchQuery && filteredProducts.length === 0 && (
             <div className="px-4 py-8 text-center text-gray-500">
                <span className="material-icons text-4xl mb-2 text-gray-300">search_off</span>
                <p>No products found matching "{searchQuery}"</p>
                <button onClick={handleHomeClick} className="text-primary mt-2 font-medium">Clear Search</button>
             </div>
          )}

          {/* Featured Products */}
          <div className="px-4 mb-8">
            {featuredProducts.length > 0 && <h3 className="text-xl font-bold mb-4 md:mb-6">Featured</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <FeaturedProduct 
                  key={product.id} 
                  product={product} 
                  isAdmin={isAdmin}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  isInCart={isProductInCart(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
          
          {/* New Arrivals Grid */}
          <div className="px-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">New Arrivals</h3>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  <span className="material-icons text-xl">grid_view</span>
                </button>
                <button className="p-1 text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                  <span className="material-icons text-xl">view_list</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {gridProducts.map(product => (
                <GridProduct 
                  key={product.id} 
                  product={product} 
                  isAdmin={isAdmin}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  isInCart={isProductInCart(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  isWishlisted={isProductInWishlist(product.id)}
                  onToggleWishlist={() => handleToggleWishlist(product)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {gridProducts.length > 0 && (
              <div className="flex justify-center mt-12 mb-8">
                <nav className="flex items-center space-x-2">
                  <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">Prev</button>
                  <button className="px-4 py-2 rounded bg-secondary text-white text-sm">1</button>
                  <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">2</button>
                  <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">3</button>
                  <span className="text-gray-500">...</span>
                  <button className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">Next</button>
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
      
      <EditProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
      
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
      />

      <WishlistModal 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveItem={(id) => setWishlist(prev => prev.filter(p => p.id !== id))}
        onMoveToCart={handleMoveToCart}
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