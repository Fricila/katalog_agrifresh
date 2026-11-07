import React from 'react';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Apple
} from 'lucide-react';

export const HeroBanner = ({ storeSettings, onShopNow }) => {
  const storeName = storeSettings?.storeName || 'AgriFresh';
  const storePhone = (storeSettings?.phone || '6285777435992').replace(/[^0-9]/g, '');
  const storeTagline = storeSettings?.tagline || 'Sayur & Buah Segar Langsung dari Kebun';

  const handleScrollToProducts = () => {
    if (onShopNow) {
      onShopNow();
    } else {
      const el = document.getElementById('produk-pilihan');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(`Halo ${storeName}, saya ingin tanya seputar produk sayur dan buah segar hari ini!`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // High quality realistic image of fresh vegetable and fruit basket (carrots, broccoli, tomatoes, apples, oranges, grapes)
  const heroImage = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=80';

  return (
    <section className="hero-section" id="beranda">
      <div className="container">
        <div className="hero-grid">
          {/* Left Text Content */}
          <div className="hero-content animate-fade-in">
            {/* Natural Leaf Badge */}
            <div className="hero-badge">
              <Sprout size={16} />
              <span>100% Organik & Dipetik Segar Tiap Pagi</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              Sayur & Buah Segar <span>Langsung dari Kebun</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-desc">
              {storeTagline}. Nikmati kesegaran produk berkualitas untuk hidup lebih sehat langsung dari petani mitra terpercaya {storeName}.
            </p>

            {/* Features Chip Row */}
            <div className="hero-features-chips">
              <span className="hero-chip">
                <CheckCircle2 size={16} />
                <span>Tanpa Pestisida Berbahaya</span>
              </span>
              <span className="hero-chip">
                <CheckCircle2 size={16} />
                <span>Garansi Segar 24 Jam</span>
              </span>
              <span className="hero-chip">
                <CheckCircle2 size={16} />
                <span>Mitra Petani Lokal</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleScrollToProducts}
                id="btn-hero-shop-now"
                style={{ padding: '0.85rem 1.85rem', fontSize: '1.05rem' }}
              >
                <span>Belanja Sekarang</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleOpenWhatsApp}
                title="Tanya ketersediaan stok via WhatsApp"
                style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                <MessageCircle size={18} />
                <span>Chat Petani Kami</span>
              </button>
            </div>
          </div>

          {/* Right Visual Image with Organic Badges */}
          <div className="hero-visual-wrapper animate-fade-in">
            <div className="hero-circle-bg"></div>

            <img
              src={heroImage}
              alt={`Keranjang sayur dan buah segar ${storeName}`}
              className="hero-basket-img"
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80';
              }}
            />

            {/* Floating Organic Badge 1 (Top Right) */}
            <div className="floating-badge badge-top">
              <div className="float-icon-box">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="float-badge-title">Grade A Premium</div>
                <div className="float-badge-sub">Dipetik Jam 05.00 Pagi</div>
              </div>
            </div>

            {/* Floating Organic Badge 2 (Bottom Left) */}
            <div className="floating-badge badge-bottom">
              <div className="float-icon-box" style={{ background: 'var(--orange-soft)', color: 'var(--orange-accent)' }}>
                <Clock size={18} />
              </div>
              <div>
                <div className="float-badge-title">Sameday Delivery</div>
                <div className="float-badge-sub">Segar Sampai di Dapur Anda</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

