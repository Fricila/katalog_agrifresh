import React from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  HeartHandshake,
  Sprout
} from 'lucide-react';

export const StoreFeatures = () => {
  const features = [
    {
      icon: <Sprout size={26} />,
      title: 'Produk Berkualitas',
      subtitle: 'Pilihan Terbaik',
      description: 'Sayur & buah dipanen saat tingkat kematangan sempurna dari mitra petani hidroponik & organik.'
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'Pembayaran Aman',
      subtitle: 'Terpercaya',
      description: 'Transaksi mudah dan terverifikasi melalui Transfer Bank, QRIS instan, maupun COD saat barang tiba.'
    },
    {
      icon: <Truck size={26} />,
      title: 'Pengiriman Cepat',
      subtitle: 'Ke Seluruh Wilayah',
      description: 'Didukung kurir khusus berpendingin untuk memastikan kesegaran daun dan buah tetap 100% terjaga.'
    },
    {
      icon: <HeartHandshake size={26} />,
      title: 'Layanan Ramah',
      subtitle: 'Siap Membantu',
      description: 'Customer service kami siap membantu Anda konsultasi kebutuhan nutrisi keluarga via WhatsApp.'
    }
  ];

  return (
    <section className="features-section" id="keunggulan">
      <div className="container">
        <div className="section-header animate-fade-in" style={{ marginBottom: '2.5rem' }}>
          <span className="section-badge">
            <ShieldCheck size={14} />
            <span>Mengapa Memilih Kami</span>
          </span>
          <h2 className="section-title">Keunggulan AgriFresh</h2>
          <p className="section-subtitle">
            Standar kesegaran dan kenyamanan belanja sayur & buah terbaik untuk keluarga Indonesia
          </p>
        </div>

        <div className="features-grid animate-fade-in">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-box">
                {f.icon}
              </div>
              <div>
                <h4 className="feature-title">{f.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--orange-accent)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {f.subtitle}
                </div>
                <p className="feature-desc">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

