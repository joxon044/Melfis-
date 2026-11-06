import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, SHOP_INFO } from './data/flowers';
import { apiRequest } from './api';

// Components
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoriesFilter from './components/CategoriesFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import BouquetBuilder from './components/BouquetBuilder';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import OrderSuccessModal from './components/OrderSuccessModal';
import ReviewsSection from './components/ReviewsSection';
import InstagramSection from './components/InstagramSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import QuickContactFloating from './components/QuickContactFloating';
import AccountModal from './components/AccountModal';
import AdminOrdersPanel from './components/AdminOrdersPanel';

export default function App() {
  // Cart & Wishlist states with localStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('melfis_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('melfis_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('melfis_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('melfis_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isActive = true;
    apiRequest('/api/auth/me')
      .then(({ user }) => {
        if (isActive) setCurrentUser(user);
      })
      .catch((error) => {
        if (isActive) setAuthError(error.message);
      });
    return () => {
      isActive = false;
    };
  }, []);

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      const addQty = product.quantity || 1;

      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + addQty }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: addQty }];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const handleToggleFavorite = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by Occasion
    if (selectedOccasion !== 'Barchasi') {
      result = result.filter((p) => p.occasion === selectedOccasion);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.composition.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // 'popular'
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return result;
  }, [selectedCategory, selectedOccasion, searchQuery, sortBy]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20 2xl:pb-0 bg-[#FAF7F2] text-[#1A1818] flex flex-col font-sans">
      
      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        user={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSubmitSearch={(query) => {
          setSelectedCategory('all');
          setSelectedOccasion('Barchasi');
          setSearchQuery(query);
        }}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreClick={() => {
          const el = document.getElementById('catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onBuilderClick={() => {
          const el = document.getElementById('builder');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <section id="catalog" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Nafis Kolleksiya
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            Gullar va Mualliflik Guldastalari
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-500">
            Samarqand bo'ylab 24/7 tezkor yetkazib berish xizmati bilan eng sara gullar
          </p>
        </div>

        {/* Categories, Occasions & Sorting */}
        <CategoriesFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedOccasion={selectedOccasion}
          setSelectedOccasion={setSelectedOccasion}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultsCount={filteredProducts.length}
        />

        {/* Products Grid */}
        <div className="mt-8">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-stone-200">
              <div className="text-4xl mb-3">🌸</div>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                Guldastalar topilmadi
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring, yoki o'zingiz xohlagan guldastani konstruktorda yarating.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedOccasion('Barchasi');
                  setSearchQuery('');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-[#1C3F3A] text-white text-xs font-semibold hover:bg-[#15302C]"
              >
                Barcha filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  isFavorite={isFavorite(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

      </section>

      {/* Interactive Bouquet Builder */}
      <BouquetBuilder onAddToCart={handleAddToCart} />

      {/* Authentic Instagram Section */}
      <InstagramSection />

      {/* Customer Reviews Section */}
      <ReviewsSection />

      {/* Store Location & Pavarot Interactive Map */}
      <LocationSection />

      {/* Footer */}
      <Footer onCategoryClick={(catId) => setSelectedCategory(catId)} />

      {/* Drawers and Modals */}
      <ProductModal
        key={selectedProduct?.id ?? 'closed'}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currentUser={currentUser}
        onRequireAuth={() => setIsAccountOpen(true)}
        onCreateOrder={(order) => apiRequest('/api/orders', { method: 'POST', body: order }).then((result) => result.order)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderSuccess={(orderData) => setOrderSuccessData(orderData)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={(id) => setWishlistItems(prev => prev.filter(i => i.id !== id))}
        onAddToCart={handleAddToCart}
        onOpenProductModal={(item) => setSelectedProduct(item)}
      />

      <OrderSuccessModal
        orderData={orderSuccessData}
        onClose={() => setOrderSuccessData(null)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        user={currentUser}
        initialError={authError}
        onClose={() => setIsAccountOpen(false)}
        onAuth={(user) => {
          setCurrentUser(user);
          setAuthError('');
          setIsAccountOpen(false);
        }}
        onLogout={() => setCurrentUser(null)}
        onOpenAdmin={() => {
          setIsAccountOpen(false);
          setIsAdminPanelOpen(true);
        }}
      />
      {isAdminPanelOpen && (
        <AdminOrdersPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}

      {/* Floating 24/7 Action Button */}
      <QuickContactFloating />

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        setActiveTab={setActiveMobileTab}
        cartCount={totalCartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

    </div>
  );
}
