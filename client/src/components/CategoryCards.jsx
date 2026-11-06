import React from 'react';
import { Layers, Sprout } from 'lucide-react';

const CATEGORY_VISUALS = {
  all: {
    name: 'Semua Produk',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'
  },
  sayuran: {
    name: 'Sayuran',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'
  },
  buah: {
    name: 'Buah',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80'
  },
  'salad-buah': {
    name: 'Salad Buah',
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=300&q=80'
  },
  'salad-sayur': {
    name: 'Salad Sayur',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80'
  }
};

export const CategoryCards = ({
  categories = [],
  activeCategoryId = '',
  onSelectCategory,
  totalProductsCount = 0
}) => {
  // Find appropriate visual based on slug or name
  const getVisual = (cat) => {
    const slug = (cat.slug || cat.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (slug.includes('sayur') && slug.includes('salad')) return CATEGORY_VISUALS['salad-sayur'];
    if (slug.includes('buah') && slug.includes('salad')) return CATEGORY_VISUALS['salad-buah'];
    if (slug.includes('sayur')) return CATEGORY_VISUALS.sayuran;
    if (slug.includes('buah')) return CATEGORY_VISUALS.buah;
    return {
      name: cat.name,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80'
    };
  };

  const handleCardClick = (id) => {
    onSelectCategory(id);
    const el = document.getElementById('produk-pilihan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="category-section" id="kategori">
      <div className="container">
        {/* Section Header */}
        <div className="section-header animate-fade-in">
          <span className="section-badge">
            <Sprout size={14} />
            <span>Kategori Pilihan</span>
          </span>
          <h2 className="section-title">Jelajahi Produk Segar</h2>
          <p className="section-subtitle">
            Pilih kelompok sayur, buah, atau olahan salad segar favorit keluarga Anda
          </p>
        </div>

        {/* Horizontal Category Cards */}
        <div className="category-cards-grid animate-fade-in">
          {/* Card: Semua Produk */}
          <div
            className={`category-card ${activeCategoryId === '' ? 'active' : ''}`}
            onClick={() => handleCardClick('')}
            role="button"
            tabIndex={0}
            id="cat-card-all"
          >
            <div className="category-thumb-wrapper">
              <img
                src={CATEGORY_VISUALS.all.image}
                alt="Semua Produk"
                className="category-thumb-img"
                loading="lazy"
              />
            </div>
            <h3 className="category-card-name">Semua Produk</h3>
            <span className="category-card-count">{totalProductsCount} Produk</span>
          </div>

          {/* Dynamic Category Cards */}
          {categories.map((cat) => {
            const visual = getVisual(cat);
            const isActive = activeCategoryId === cat.id;
            return (
              <div
                key={cat.id}
                className={`category-card ${isActive ? 'active' : ''}`}
                onClick={() => handleCardClick(cat.id)}
                role="button"
                tabIndex={0}
                id={`cat-card-${cat.id}`}
              >
                <div className="category-thumb-wrapper">
                  <img
                    src={visual.image}
                    alt={cat.name}
                    className="category-thumb-img"
                    loading="lazy"
                  />
                </div>
                <h3 className="category-card-name">{cat.name}</h3>
                <span className="category-card-count">
                  {cat.productCount !== undefined ? `${cat.productCount} Produk` : 'Tersedia'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

