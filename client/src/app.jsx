import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  fetchCategories,
  fetchStoreSettings,
  fetchAdminProfile,
  clearAuthToken,
  getAuthToken
} from './services/api';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryCards } from './components/CategoryCards';
import { ProductCard } from './components/ProductCard';
import { PromoBanner } from './components/PromoBanner';
import { StoreFeatures } from './components/StoreFeatures';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderModal } from './components/OrderModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import {
  Sprout,
  Search,
  X,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';

export function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProductForOrder, setSelectedProductForOrder] = useState(null);

  // Cart & Favorites State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('agrifresh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('agrifresh_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin authentication & views
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('agrifresh_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem('agrifresh_favs', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Load all initial data from backend
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, storeRes] = await Promise.allSettled([
        fetchProducts(),
        fetchCategories(),
        fetchStoreSettings()
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value) {
        const prodData = prodRes.value.data || prodRes.value;
        if (Array.isArray(prodData)) {
          setProducts(prodData);
        }
      } else if (prodRes.status === 'rejected') {
        console.error('Gagal mengambil produk:', prodRes.reason);
      }

      if (catRes.status === 'fulfilled' && catRes.value) {
        const catData = catRes.value.data || catRes.value;
        if (Array.isArray(catData)) {
          setCategories(catData);
        }
      } else if (catRes.status === 'rejected') {
        console.error('Gagal mengambil kategori:', catRes.reason);
      }

      if (storeRes.status === 'fulfilled' && storeRes.value) {
        const sData = storeRes.value.data || storeRes.value;
        if (sData) {
          setStoreSettings(sData);
        }
      } else if (storeRes.status === 'rejected') {
        console.error('Gagal mengambil pengaturan toko:', storeRes.reason);
      }
    } catch (err) {
      console.error('Gagal mengambil data katalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore authenticated session on mount if token exists
  useEffect(() => {
    loadData();

    const token = getAuthToken();
    if (token) {
      fetchAdminProfile()
        .then((res) => {
          if (res?.user) setAdminUser(res.user);
        })
        .catch(() => {
          clearAuthToken();
          setAdminUser(null);
        });
    }
  }, []);

  // Dynamically update document title based on store settings
  useEffect(() => {
    if (storeSettings?.storeName) {
      document.title = `${storeSettings.storeName} - ${storeSettings.tagline || 'Fresh Garden Market'}`;
    }
  }, [storeSettings]);

  // Handle Logout
  const handleLogout = () => {
    clearAuthToken();
    setAdminUser(null);
    setIsAdminView(false);
  };

  // Cart Operations
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const handleUpdateCartQty = (productId, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Favorite toggle
  const handleToggleFavorite = (productId) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Filter products for Customer Catalog View
  const filteredProducts = products.filter((p) => {
    const matchesCat = !activeCategoryId || String(p.categoryId) === String(activeCategoryId);
    const term = (search || '').trim().toLowerCase();
    const pName = (p.name || p.Name || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();
    const pCat = (p.categoryName || '').toLowerCase();

    const matchesSearch =
      !term ||
      pName.includes(term) ||
      pDesc.includes(term) ||
      pCat.includes(term);

    return matchesCat && matchesSearch;
  });

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-layout">
      {/* FLOW 2: ADMIN BACK-OFFICE WITH DEDICATED SIDEBAR */}
      {isAdminView && adminUser ? (
        <AdminDashboard
          products={products}
          categories={categories}
          storeSettings={storeSettings}
          adminUser={adminUser}
          onRefreshData={loadData}
          onBackToCatalog={() => setIsAdminView(false)}
          onLogout={handleLogout}
        />
      ) : (
        /* FLOW 1: CUSTOMER CATALOG & MODERN ORGANIC MARKET */
        <>
          {/* Header & Navbar */}
          <Header
            storeSettings={storeSettings}
            isAdminView={isAdminView}
            setIsAdminView={setIsAdminView}
            adminUser={adminUser}
            onOpenLogin={() => setIsAdminLoginOpen(true)}
            onLogout={handleLogout}
            cartCount={totalCartCount}
            onOpenCart={() => setIsCartOpen(true)}
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
            search={search}
            setSearch={setSearch}
          />

          <main className="customer-catalog-view">
            {/* 1. Hero Banner */}
            <HeroBanner
              storeSettings={storeSettings}
              onShopNow={() => {
                const el = document.getElementById('produk-pilihan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. Kategori Produk (Horizontal Cards) */}
            <CategoryCards
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              totalProductsCount={products.length}
            />

            {/* 3. Produk Pilihan (Catalog Grid & Search) */}
            <section className="products-section" id="produk-pilihan">
              <div className="container">
                {/* Section Title Header */}
                <div className="section-header animate-fade-in">
                  <span className="section-badge">
                    <Sprout size={14} />
                    <span>Pilihan Segar Hari Ini</span>
                  </span>
                  <h2 className="section-title">Produk Pilihan</h2>
                  <p className="section-subtitle">
                    Kualitas grade A dipetik subuh dan dikemas higienis langsung untuk dapur Anda
                  </p>
                </div>

                {/* Promo Banner "Belanja Lebih Mudah!" */}
                <PromoBanner storeSettings={storeSettings} />

                {/* Search Bar & Instant Filter Bar */}
                <div className="search-filter-bar animate-fade-in">
                  <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      id="product-search-input"
                      placeholder="Cari sayur & buah segar... (cth: Pakcoy, Wortel, Apel, Mangga)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setSearch('')}
                        title="Hapus pencarian"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {activeCategoryId && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveCategoryId('')}
                      style={{ borderRadius: 'var(--radius-full)' }}
                    >
                      <X size={14} />
                      <span>Reset Kategori</span>
                    </button>
                  )}
                </div>

                {/* Loading Indicator */}
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                    <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: 'var(--sage-green)' }} />
                    <p style={{ fontWeight: 600 }}>Memuat katalog sayur & buah segar...</p>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  /* Products Grid */
                  <div className="products-grid animate-fade-in">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onSelectProduct={setSelectedProductForOrder}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div
                    className="animate-fade-in"
                    style={{
                      textAlign: 'center',
                      padding: '4rem 1.5rem',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-2xl)',
                      border: '1.5px solid var(--cream-border)',
                      maxWidth: '520px',
                      margin: '2rem auto'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--soft-green)',
                        color: 'var(--dark-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem'
                      }}
                    >
                      <Sprout size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--dark-green)', marginBottom: '0.5rem' }}>
                      Produk Tidak Ditemukan
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                      Tidak ada produk yang cocok dengan pencarian "{search}". Coba kata kunci lain atau tampilkan seluruh menu.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSearch('');
                        setActiveCategoryId('');
                      }}
                    >
                      <span>Tampilkan Semua Produk</span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* 4. Keunggulan Toko */}
            <StoreFeatures storeSettings={storeSettings} />

            {/* 5. Tentang Kami Section */}
            <AboutSection storeSettings={storeSettings} />

            {/* 6. Footer */}
            <Footer storeSettings={storeSettings} />
          </main>
        </>
      )}

      {/* Cart Sliding Drawer with WhatsApp Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        storeSettings={storeSettings}
      />

      {/* Direct Order Details Form Modal */}
      {selectedProductForOrder && (
        <OrderModal
          product={selectedProductForOrder}
          storeSettings={storeSettings}
          onClose={() => setSelectedProductForOrder(null)}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={(user) => {
          setAdminUser(user);
          setIsAdminView(true);
        }}
      />
    </div>
  );
}

export default App;
