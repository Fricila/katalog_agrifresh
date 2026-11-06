import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';

export const ProductCard = ({
  product,
  onAddToCart,
  onSelectProduct,
  isFavorite = false,
  onToggleFavorite
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const isAvailable = product.stockStatus === 'Tersedia';

  // Format Indonesian Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // Safe fallback image for fresh grocery
  const fallbackImage = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
  const hasValidImage = product.image && product.image !== '-' && product.image !== '_' && product.image.trim() !== '';
  const displayImage = hasValidImage ? product.image : fallbackImage;
  const productName = product.name || product.Name || 'Produk Segar';

  // Derive unit (e.g. kg, ikat, bowl, porsi, sisir)
  const productUnit = product.unit || (
    product.categoryName === 'Sayuran' ? 'ikat' :
    product.categoryName?.toLowerCase().includes('salad') ? 'bowl' :
    product.name?.toLowerCase().includes('pisang') ? 'sisir' : 'kg'
  );

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAdd = () => {
    if (!isAvailable) return;
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setIsAddedFeedback(true);
      setTimeout(() => setIsAddedFeedback(false), 1500);
    }
  };

  return (
    <div
      className={`product-card animate-fade-in ${!isAvailable ? 'out-of-stock' : ''}`}
      id={`product-${product.id}`}
    >
      {/* Top Floating Actions: Stock Status & Favorite Heart */}
      <div className="product-card-top-bar">
        <span className={`product-stock-tag ${isAvailable ? 'available' : 'unavailable'}`}>
          {isAvailable ? (
            <>
              <CheckCircle2 size={12} />
              <span>Tersedia</span>
            </>
          ) : (
            <>
              <XCircle size={12} />
              <span>Stok Habis</span>
            </>
          )}
        </span>

        <button
          type="button"
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(product.id);
          }}
          title={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          aria-label="Favoritkan produk"
        >
          <Heart size={16} fill={isFavorite ? '#EF4444' : 'none'} />
        </button>
      </div>

      {/* Product Image Container */}
      <div
        className="product-image-box"
        onClick={() => onSelectProduct && onSelectProduct(product)}
        title="Klik untuk detail pemesanan"
      >
        <img
          src={displayImage}
          alt={productName}
          className="product-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />

        {/* Category Pill Tag */}
        <span className="product-cat-tag">
          {product.categoryName || 'Organik'}
        </span>
      </div>

      {/* Product Details Content */}
      <div className="product-content">
        <h3
          className="product-title"
          title={productName}
          onClick={() => onSelectProduct && onSelectProduct(product)}
          style={{ cursor: 'pointer' }}
        >
          {productName}
        </h3>

        {product.description && (
          <p className="product-desc" title={product.description}>
            {product.description}
          </p>
        )}

        {/* Price & Unit Row */}
        <div className="product-price-row">
          <span className="product-price">{formatRupiah(product.price)}</span>
          <span className="product-unit">/ {productUnit}</span>
        </div>

        {/* Bottom Actions Bar: Quantity Adjuster, Add to Cart, Quick WA Order */}
        <div className="product-actions-bar">
          {/* Quantity Selector (- and +) */}
          <div className="qty-counter">
            <button
              type="button"
              className="qty-btn"
              onClick={() => handleQtyChange(-1)}
              disabled={!isAvailable || quantity <= 1}
              aria-label="Kurangi jumlah"
            >
              <Minus size={14} />
            </button>
            <span className="qty-number">{quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => handleQtyChange(1)}
              disabled={!isAvailable}
              aria-label="Tambah jumlah"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            className="btn-add-cart"
            onClick={handleAdd}
            disabled={!isAvailable}
            title={isAvailable ? 'Tambahkan ke keranjang belanja' : 'Stok produk habis'}
          >
            <ShoppingBag size={16} />
            <span>{isAddedFeedback ? '✓ Ditambahkan' : '+ Keranjang'}</span>
          </button>

          {/* Direct WhatsApp Order Icon Button */}
          {onSelectProduct && (
            <button
              type="button"
              className="btn-quick-wa"
              onClick={() => onSelectProduct(product)}
              disabled={!isAvailable}
              title="Pesan instan via WhatsApp"
              aria-label="Pesan via WhatsApp"
            >
              <MessageCircle size={17} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
