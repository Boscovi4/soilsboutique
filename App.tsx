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
import { ProfilePage } from './components/ProfilePage';
import { Toast } from './components/Toast';
import { PRODUCTS, WHATSAPP_NUMBER, CATEGORIES } from './constants';
import { Product, UserProfile } from './types';

const ITEMS_PER_PAGE = 12;

const App: React.FC = () => {
  // --- Data Initialization ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('soils-products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRODUCTS; }
    }
    return PRODUCTS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('soils-current-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // If user is admin, they have admin privileges
  const isAdmin = currentUser?.role === 'admin';

  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // --- UI State ---
  const [currentView, setCurrentView] = useState<'shop' | 'profile'>('shop');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // --- Modals State ---
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  // --- Selection State ---
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);
  const [variantAction, setVariantAction] = useState<'cart' | 'whatsapp' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('soils-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('soils-current-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('soils-current-user');
    }
  }, [currentUser]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // --- Auth & Profile Logic ---
  const handleLogin = (u: string, p: string) => {
    // Hardcoded auth logic for demo
    if (u === 'Fanya' && p === '1234') {
      const adminUser: UserProfile = {
        id: '1',
        username: 'Fanya',
        fullName: 'Fanya Owner',
        email: 'fanya@soilsboutique.com',
        role: 'admin',
        preferences: { notifications: true, language: 'en' }
      };
      setCurrentUser(adminUser);
      setIsLoginModalOpen(false);
      showToast('Welcome back, Fanya!');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('shop');
    showToast('Logged out successfully', 'info');
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    showToast('Profile updated successfully');
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setCurrentView('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // --- Filtering Logic ---
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || 
                            (activeCategory === 'mens' && p.name.toLowerCase().includes('men')) || 
                            (activeCategory === 'womens' && p.name.toLowerCase().includes('women')) ||
                            (activeCategory === 'accessories' && (p.name.toLowerCase().includes('hat') || p.name.toLowerCase().includes('bag')));
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = filteredProducts.filter(p => p.type === 'featured');
  const allGridProducts = filteredProducts.filter(p => p.type === 'grid');

  // --- Pagination ---
  const totalPages = Math.ceil(allGridProducts.length / ITEMS_PER_PAGE);
  const currentGridProducts = allGridProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('product-grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // --- Product Management (Admin) ---
  const handleEditProduct = (product: Product) => { setEditingProduct(product); setIsModalOpen(true); };
  const handleAddProduct = () => { setEditingProduct(null); setIsModalOpen(true); };
  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === product.id);
      if (index >= 0) {
        const newProducts = [...prev];
        newProducts[index] = product;
        showToast('Product updated');
        return newProducts;
      } else {
        showToast('Product added');
        return [product, ...prev];
      }
    });
  };
  const handleBulkUpload = (newProducts: Product[]) => {
    setProducts(prev => [...newProducts, ...prev]);
    showToast(`Added ${newProducts.length} products!`);
  };
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(p => p.id !== id));
    if (editingProduct?.id === id) { setIsModalOpen(false); setEditingProduct(null); }
    showToast('Product deleted', 'info');
  };

  // --- Cart/Wishlist Actions ---
  const handleProductAction = (type: 'whatsapp' | 'cart', product: Product) => {
    const hasVariants = (product.sizes?.length ?? 0) > 0 || (product.color?.split(',').length ?? 0) > 1;
    if (hasVariants) {
      setVariantProduct(product);
      setVariantAction(type);
      setVariantModalOpen(true);
    } else {
      type === 'whatsapp' ? openWhatsApp(product) : addToCartInternal(product);
    }
  };
  const openWhatsApp = (product: Product, size?: string, color?: string) => {
     const details = `${size ? ` Size: ${size}` : ''}${color ? ` Color: ${color}` : ''}`;
     const text = `Olá, ha'u interese ho ${product.name}${details}. Sei iha ka lae?`;
     const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
     const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';
     window.open(`${baseUrl}?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`, '_blank');
  };
  const addToCartInternal = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const cartItemId = `${product.id}-${size || 'def'}-${color || 'def'}`;
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        showToast(`Updated quantity`);
        return prev.map(i => i.cartItemId === cartItemId ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      showToast('Added to cart');
      return [...prev, { ...product, selectedSize: size, selectedColor: color, cartItemId, quantity: 1 }];
    });
  };
  const handleUpdateCartQuantity = (id: string, chg: number) => {
    setCart(prev => prev.map(i => i.cartItemId === id ? { ...i, quantity: Math.max(1, (i.quantity || 1) + chg) } : i));
  };
  const handleRemoveFromCart = (id: string) => { setCart(prev => prev.filter(p => (p.cartItemId || p.id) !== id)); };
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      showToast(exists ? 'Removed from wishlist' : 'Added to wishlist', exists ? 'info' : 'success');
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
    });
  };

  // --- Navigation ---
  const handleHomeClick = () => { setCurrentView('shop'); setSearchQuery(''); setActiveCategory('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleSearchClick = () => { setCurrentView('shop'); setTimeout(() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(), 100); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="min-h-screen w-full mx-auto bg-white dark:bg-background-dark relative">
      {/* Conditionally render NavBar only in Shop View, or keep it but change buttons? 
          ProfilePage has its own header. Let's hide NavBar when in Profile view to give it a native app feel. */}
      {currentView === 'shop' && (
        <NavBar 
          isAdmin={isAdmin} 
          onToggleAdmin={handleProfileClick} // Map Admin button to Profile
          cartCount={cart.reduce((acc, item) => acc + (item.quantity || 1), 0)}
          onCartClick={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <main>
        {currentView === 'profile' && currentUser ? (
          <ProfilePage 
            user={currentUser} 
            onSave={handleUpdateProfile} 
            onLogout={handleLogout}
            onBack={handleHomeClick}
          />
        ) : (
          /* SHOP VIEW */
          <>
            <HeroSection products={products} onAction={handleProductAction} />
            <div id="shop-section" className="max-w-[1920px] mx-auto pb-24">
              <CategoryRail activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

              {isAdmin && (
                <div className="px-4 mb-6 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                   <button onClick={handleAddProduct} className="bg-secondary text-white border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-opacity-90 shadow-lg">
                     <span className="material-icons text-3xl">add_circle_outline</span><span className="font-semibold text-sm">Add Product</span>
                   </button>
                   <button onClick={() => setIsBulkModalOpen(true)} className="bg-primary text-white border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-opacity-90 shadow-lg">
                     <span className="material-icons text-3xl">playlist_add</span><span className="font-semibold text-sm">Bulk Upload</span>
                   </button>
                </div>
              )}
              
              {filteredProducts.length === 0 && (
                 <div className="px-4 py-16 text-center text-gray-500 min-h-[50vh] flex flex-col items-center justify-center">
                    <span className="material-icons text-6xl mb-4 text-gray-200">checkroom</span>
                    <p className="text-lg font-medium">No products found matching "{searchQuery}"</p>
                    <button onClick={handleHomeClick} className="text-primary mt-2 font-bold px-6 py-2 border border-primary rounded-full">Clear Filters</button>
                 </div>
              )}

              {featuredProducts.length > 0 && (
                <div className="px-4 mb-8">
                  <h3 className="text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
                    <span className="material-icons text-yellow-500">local_fire_department</span> Featured Collections
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                      <FeaturedProduct key={product.id} product={product} isAdmin={isAdmin} onEdit={handleEditProduct} onDelete={handleDeleteProduct} isInCart={cart.some(p => p.id === product.id)} onAction={handleProductAction} />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="px-4" id="product-grid-section">
                {allGridProducts.length > 0 && (
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{activeCategory === 'all' ? 'New Arrivals' : `${CATEGORIES.find(c => c.id === activeCategory)?.name} Collection`}</h3>
                    <span className="text-xs text-gray-400">{allGridProducts.length} items</span>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
                  {currentGridProducts.map(product => (
                    <GridProduct key={product.id} product={product} isAdmin={isAdmin} onEdit={handleEditProduct} onDelete={handleDeleteProduct} isInCart={cart.some(p => p.id === product.id)} onAction={handleProductAction} isWishlisted={wishlist.some(p => p.id === product.id)} onToggleWishlist={() => handleToggleWishlist(product)} />
                  ))}
                </div>
                {allGridProducts.length > ITEMS_PER_PAGE && (
                  <div className="flex justify-center mt-12 mb-8">
                    <nav className="flex items-center space-x-2">
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark disabled:opacity-50"><span className="material-icons">chevron_left</span></button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${currentPage === page ? 'bg-secondary text-white shadow-md' : 'border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark'}`}>{page}</button>
                      ))}
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-card-dark disabled:opacity-50"><span className="material-icons">chevron_right</span></button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Bottom Nav remains visible to switch back to home/search */}
      <BottomNav 
        onHomeClick={handleHomeClick}
        onSearchClick={handleSearchClick}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onProfileClick={handleProfileClick}
        wishlistCount={wishlist.length}
        activeTab={currentView === 'profile' ? 'profile' : 'home'}
      />
      
      {/* Global Components */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <EditProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={editingProduct} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />
      <BulkUploadModal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} onUpload={handleBulkUpload} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cart} onRemoveItem={handleRemoveFromCart} onUpdateQuantity={handleUpdateCartQuantity} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistItems={wishlist} onRemoveItem={(id) => setWishlist(prev => prev.filter(p => p.id !== id))} onMoveToCart={(p) => { handleToggleWishlist(p); handleProductAction('cart', p); }} />
      <ProductVariantModal isOpen={variantModalOpen} onClose={() => setVariantModalOpen(false)} product={variantProduct} actionType={variantAction} onConfirm={addToCartInternal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default App;