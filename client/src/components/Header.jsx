import React, { useState, useEffect, useRef } from 'react';
import brandLogo from '../assets/AgriFresh.png';
import {
  Sprout,
  ShoppingBag,
  Search,
  Lock,
  LogOut,
  LayoutDashboard,
  Store,
  ChevronDown,
  Menu,
  X,
  Phone,
  Info,
  Layers,
  Heart
} from 'lucide-react';

export const Header = ({
  storeSettings,
  isAdminView,
  setIsAdminView,
  adminUser,
  onOpenLogin,
  onLogout,
  cartCount = 0,
  onOpenCart,
  categories = [],
  activeCategoryId = '',
  onSelectCategory,
  search = '',
  setSearch
}) => {
  const storeName = storeSettings?.storeName || 'AgriFresh';
  const storeTagline = storeSettings?.tagline || 'Fresh Garden Market';
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
    const el = document.getElementById('produk-pilihan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavScroll = (elementId) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Brand Logo on the left */}
        <div
          className="brand-group"
          onClick={() => {
            if (setIsAdminView) setIsAdminView(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title={`${storeName} - ${storeTagline}`}
        >
          <img
            src={brandLogo}
            alt={storeName}
            className="brand-logo-img"
          />
          <div className="brand-info">
            <span className="brand-name">
              {storeName}
            </span>
            <span className="brand-tag">{storeTagline}</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="header-nav">
          <a
            href="#beranda"
            className="nav-link active"
            onClick={(e) => {
              e.preventDefault();
              handleNavScroll('beranda');
            }}
          >
            Beranda
          </a>

          {/* Kategori with Dropdown */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              className="nav-link"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <span>Kategori</span>
              <ChevronDown size={15} style={{ transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isCategoryDropdownOpen && (
              <div className="dropdown-menu">
                <button
                  type="button"
                  className={`dropdown-item ${activeCategoryId === '' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('')}
                >
                  <Layers size={16} />
                  <span>Semua Produk</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`dropdown-item ${activeCategoryId === cat.id ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <Sprout size={16} />
                    <span>{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span className="dropdown-badge">{cat.productCount}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="#tentang-kami"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavScroll('tentang-kami');
            }}
          >
            Tentang Kami
          </a>

          <a
            href="#kontak"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavScroll('kontak');
            }}
          >
            Kontak
          </a>
        </nav>

        {/* Search Bar in Navbar for Fast Produce Search */}
        <div className="header-search-wrapper">
          <Search size={16} className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Cari sayur & buah..."
            value={search}
            onChange={(e) => {
              if (setSearch) setSearch(e.target.value);
            }}
            onFocus={() => {
              const el = document.getElementById('produk-pilihan');
              if (el && window.scrollY < 250) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
          {search && (
            <button
              type="button"
              className="header-search-clear"
              onClick={() => setSearch && setSearch('')}
              title="Hapus pencarian"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">

          {/* Cart Icon with count badge */}
          <button
            type="button"
            className="cart-trigger-btn"
            onClick={onOpenCart}
            title="Buka Keranjang Belanja"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Admin Login / Status */}
          {adminUser ? (
            <div className="admin-status-bar">
              <span className="admin-badge">
                <span className="admin-dot"></span>
                <span>{adminUser.name || 'Admin'}</span>
              </span>

              {isAdminView ? (
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={() => setIsAdminView(false)}
                  title="Kembali ke tampilan katalog"
                >
                  <Store size={14} />
                  <span>Katalog</span>
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-xs"
                  onClick={() => setIsAdminView(true)}
                  title="Masuk panel admin"
                >
                  <LayoutDashboard size={14} />
                  <span>Dashboard</span>
                </button>
              )}

              <button
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
                onClick={onLogout}
                title="Keluar sesi admin"
              >
                <LogOut size={13} color="#EF4444" />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenLogin}
              id="admin-login-trigger"
              title="Login Admin Toko"
            >
              <Lock size={15} />
              <span>Login Admin</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="Buka menu navigasi"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="mobile-nav-panel animate-slide-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drawer Header */}
            <div className="mobile-nav-header">
              <div className="brand-group" style={{ cursor: 'default' }}>
                <img
                  src={brandLogo}
                  alt={storeName}
                  className="brand-logo-img brand-logo-img-mobile"
                />
                <div className="brand-info">
                  <span className="brand-name" style={{ fontSize: '1.15rem' }}>{storeName}</span>
                  <span className="brand-tag" style={{ fontSize: '0.68rem' }}>{storeTagline}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsMobileMenuOpen(false)}
                title="Tutup menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Drawer Body */}
            <div className="mobile-nav-body">
              {/* Search Inside Drawer */}
              <div className="mobile-drawer-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Cari sayur & buah..."
                  value={search}
                  onChange={(e) => setSearch && setSearch(e.target.value)}
                />
                {search && (
                  <button type="button" onClick={() => setSearch && setSearch('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Main Links */}
              <div className="mobile-nav-section-title">Navigasi Utama</div>
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleNavScroll('beranda')}
              >
                <Store size={18} />
                <span>Beranda Toko</span>
              </button>

              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenCart) onOpenCart();
                }}
              >
                <ShoppingBag size={18} />
                <span>Keranjang Belanja</span>
                {cartCount > 0 && <span className="dropdown-badge">{cartCount}</span>}
              </button>

              {/* Categories Section */}
              <div className="mobile-nav-section-title" style={{ marginTop: '0.75rem' }}>
                Kategori Produk
              </div>
              <button
                type="button"
                className={`mobile-nav-item ${activeCategoryId === '' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('')}
              >
                <Layers size={18} />
                <span>Semua Produk</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`mobile-nav-item ${activeCategoryId === c.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(c.id)}
                >
                  <Sprout size={18} />
                  <span>{c.name}</span>
                  {c.productCount !== undefined && (
                    <span className="dropdown-badge">{c.productCount}</span>
                  )}
                </button>
              ))}

              {/* Information Links */}
              <div className="mobile-nav-section-title" style={{ marginTop: '0.75rem' }}>
                Informasi & Bantuan
              </div>
              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleNavScroll('keunggulan')}
              >
                <Info size={18} />
                <span>Keunggulan Toko</span>
              </button>

              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleNavScroll('tentang-kami')}
              >
                <Info size={18} />
                <span>Tentang {storeName}</span>
              </button>

              <button
                type="button"
                className="mobile-nav-item"
                onClick={() => handleNavScroll('kontak')}
              >
                <Phone size={18} />
                <span>Kontak & Alamat</span>
              </button>
            </div>

            {/* Mobile Drawer Footer (Admin Access) */}
            <div className="mobile-nav-footer">
              {adminUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Masuk sebagai <strong>{adminUser.name || 'Admin'}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (setIsAdminView) setIsAdminView(true);
                      }}
                    >
                      <LayoutDashboard size={15} />
                      <span>Panel Admin</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      title="Keluar sesi admin"
                    >
                      <LogOut size={15} color="#ef4444" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenLogin) onOpenLogin();
                  }}
                >
                  <Lock size={15} />
                  <span>Login Admin Toko</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
