import React from 'react';
import { Sprout, CheckCircle2, Heart } from 'lucide-react';

export const AboutSection = ({ storeSettings }) => {
  const storeName = storeSettings?.storeName || 'AgriFresh';
  const tagline = storeSettings?.tagline || 'Pilihan Sayur & Buah Organik Segar Berkualitas';
  const address = storeSettings?.address || 'Sukabumi dan Jawa Barat';
  const fallbackImg = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="about-section" id="tentang-kami">
      <div className="container">
        <div className="about-card animate-fade-in">
          {/* Image Box */}
          <div className="about-img-box">
            <img
              src={fallbackImg}
              alt={`Kebun mitra petani organik ${storeName}`}
              className="about-img"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImg;
              }}
            />
          </div>

          {/* Text Content */}
          <div>
            <div className="about-tag">
              Tentang {storeName}
            </div>
            <h2 className="about-title">
              Membawa Kesegaran Kebun Langsung ke Meja Makan Anda
            </h2>
            <p className="about-text">
              <strong>{storeName}</strong> hadir dengan visi menghadirkan gaya hidup sehat yang mudah diakses bagi semua orang. Kami bekerja sama langsung dengan kelompok petani lokal di {address} untuk menghasilkan sayur hidroponik, sayuran daun hijau, dan buah-buahan segar berkualitas premium tanpa bahan kimia pengawet.
            </p>
            <p className="about-text">
              {tagline}. Setiap produk dipanen di pagi hari, disortir dengan standar kebersihan tinggi, dan dikemas secara rapi agar rasa renyah, aroma alami, dan nutrisinya tetap terjaga seutuhnya hingga Anda menyajikannya.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                <CheckCircle2 size={18} color="var(--sage-green)" />
                <span>100% Sayur & Buah Asli</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                <CheckCircle2 size={18} color="var(--sage-green)" />
                <span>Sortir Higienis Berlapis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                <CheckCircle2 size={18} color="var(--sage-green)" />
                <span>Dukung Petani Lokal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                <CheckCircle2 size={18} color="var(--sage-green)" />
                <span>Pesan Cepat via WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
