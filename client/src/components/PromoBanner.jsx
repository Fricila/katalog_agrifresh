import React from 'react';
import {
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Truck,
  BadgePercent,
  Leaf
} from 'lucide-react';

export const PromoBanner = ({ storeSettings }) => {
  const storePhone = (storeSettings?.phone || '6285777435992').replace(/[^0-9]/g, '');

  const handleChatWA = () => {
    const text = encodeURIComponent(
      'Halo AgriFresh, saya ingin belanja sayur dan buah segar melalui WhatsApp. Mohon info rekomendasi produk terbaik hari ini ya!'
    );
    window.open(`https://wa.me/${storePhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="promo-banner-card animate-fade-in" id="promo-banner">
      <div>
        <div className="promo-title-badge">
          <Sparkles size={14} />
          <span>Layanan Cepat & Praktis</span>
        </div>

        <h3 className="promo-title">Belanja Lebih Mudah!</h3>

        <p className="promo-desc">
          Tak perlu repot keluar rumah. Cukup pilih sayur & buah kesukaan Anda, kirim ke WhatsApp kami, dan pesanan segar akan langsung diantar sampai ke meja makan keluarga Anda.
        </p>

        {/* 3 Key Points */}
        <div className="promo-bullets">
          <div className="promo-bullet-item">
            <Leaf size={16} color="var(--sage-light)" />
            <span>Produk Segar Dipetik Subuh</span>
          </div>

          <div className="promo-bullet-item">
            <BadgePercent size={16} color="var(--orange-accent)" />
            <span>Harga Terbaik Langsung Petani</span>
          </div>

          <div className="promo-bullet-item">
            <Truck size={16} color="#6EE7B7" />
            <span>Pengiriman Cepat Bergaransi</span>
          </div>
        </div>
      </div>

      {/* Right Action */}
      <div className="promo-right-action">
        <button
          type="button"
          className="btn btn-accent"
          onClick={handleChatWA}
          style={{ padding: '0.85rem 1.65rem', fontSize: '1rem', width: '100%', maxWidth: '280px' }}
        >
          <MessageCircle size={19} />
          <span>Chat via WhatsApp</span>
        </button>
        <small style={{ color: '#D6E8BE', fontSize: '0.78rem' }}>
          *CS Ramah siap melayani jam 06.00 - 21.00 WIB
        </small>
      </div>
    </div>
  );
};

