import React from 'react';
import {
  Sprout,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Heart
} from 'lucide-react';

export const Footer = ({ storeSettings }) => {
  const storeName = storeSettings?.storeName || 'AgriFresh';
  const storePhone = (storeSettings?.phone || '6285777435992').replace(/[^0-9]/g, '');
  const storeAddress = storeSettings?.address || 'Jl. Sukabumi Asri No. 45, Jawa Barat, Indonesia';

  const handleOpenWA = () => {
    window.open(`https://wa.me/${storePhone}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="site-footer" id="kontak">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Desc */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--sage-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sprout size={20} />
              </div>
              <h3 className="footer-brand-title">
                Agri<span>Fresh</span>
              </h3>
            </div>

            <p className="footer-desc">
              Katalog belanja sayur, buah segar, dan olahan salad organik pilihan langsung dari kebun mitra terpercaya. Dipanen subuh, diantar segar untuk hidup sehat Anda.
            </p>

            {/* Social Media Links */}
            <div className="footer-social-row">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                title="Instagram AgriFresh"
                aria-label="Instagram"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                title="Facebook AgriFresh"
                aria-label="Facebook"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                title="Twitter / X"
                aria-label="Twitter"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <button
                type="button"
                className="footer-social-btn"
                onClick={handleOpenWA}
                title="Chat WhatsApp CS"
                aria-label="WhatsApp"
              >
                <MessageCircle size={17} />
              </button>
            </div>
          </div>

          {/* Col 2: Menu Cepat */}
          <div>
            <h4 className="footer-col-title">Menu Cepat</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#beranda">Beranda</a>
              </li>
              <li>
                <a href="#kategori">Kategori Pilihan</a>
              </li>
              <li>
                <a href="#produk-pilihan">Daftar Produk</a>
              </li>
              <li>
                <a href="#keunggulan">Keunggulan Toko</a>
              </li>
              <li>
                <a href="#tentang-kami">Tentang AgriFresh</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Kategori Utama */}
          <div>
            <h4 className="footer-col-title">Kategori Segar</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#produk-pilihan">Sayuran Hijau & Daun</a>
              </li>
              <li>
                <a href="#produk-pilihan">Buah Manis Alami</a>
              </li>
              <li>
                <a href="#produk-pilihan">Salad Buah Segar</a>
              </li>
              <li>
                <a href="#produk-pilihan">Salad Sayur Organik</a>
              </li>
              <li>
                <a href="#promo-banner">Paket Hemat Belanja</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi Kontak & Alamat */}
          <div>
            <h4 className="footer-col-title">Hubungi Kami</h4>

            <div className="footer-contact-item">
              <MapPin size={18} />
              <span>{storeAddress}</span>
            </div>

            <div className="footer-contact-item">
              <Phone size={18} />
              <span>
                WhatsApp CS: <strong>+{storePhone}</strong>
              </span>
            </div>

            <div className="footer-contact-item">
              <Clock size={18} />
              <span>Buka Setiap Hari: 06.00 - 21.00 WIB</span>
            </div>

            <div className="footer-contact-item">
              <Mail size={18} />
              <span>halo@agrifresh.id</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar Copyright */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} <strong>{storeName}</strong> • Fresh Garden Modern Organic Market. Hak Cipta Dilindungi.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Dibuat dengan</span>
            <Heart size={14} color="var(--orange-accent)" fill="var(--orange-accent)" />
            <span>untuk keluarga sehat Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
