import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Send,
  AlertCircle,
  ArrowRight,
  Sprout
} from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  storeSettings
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const storePhone = (storeSettings?.phone || '6285777435992').replace(/[^0-9]/g, '');
  const storeName = storeSettings?.storeName || 'AgriFresh';

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product.price || 0) * item.quantity;
  }, 0);

  // Total Item Count
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Fallback image helper
  const getProductImage = (prod) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80';
    if (prod.image && prod.image !== '-' && prod.image !== '_' && prod.image.trim() !== '') {
      return prod.image;
    }
    return fallbackImage;
  };

  const getProductUnit = (prod) => {
    return prod.unit || (
      prod.categoryName === 'Sayuran' ? 'ikat' :
      prod.categoryName?.toLowerCase().includes('salad') ? 'bowl' :
      prod.name?.toLowerCase().includes('pisang') ? 'sisir' : 'kg'
    );
  };

  // Build clean formatted WhatsApp message
  const generateWhatsAppMessage = () => {
    const itemsList = cartItems
      .map((item, idx) => {
        const pName = item.product.name || item.product.Name || 'Produk';
        const unit = getProductUnit(item.product);
        const itemTotal = (item.product.price || 0) * item.quantity;
        return `${idx + 1}. ${pName} (${item.quantity} ${unit}) = ${formatRupiah(itemTotal)}`;
      })
      .join('\n');

    return `Halo ${storeName}! Saya ingin memesan sayur & buah segar:

🛒 *DAFTAR PESANAN:*
${itemsList}

💰 *TOTAL BELANJA:* ${formatRupiah(subtotal)}

👤 *DATA PENGIRIMAN:*
- *Nama Pemesan:* ${customerName.trim()}
- *Alamat Pengiriman:* ${customerAddress.trim()}
- *Catatan:* ${customerNotes.trim() ? customerNotes.trim() : '-'}

Mohon konfirmasi ketersediaan & ongkos kirimnya ya. Terima kasih!`;
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerAddress.trim()) {
      setShowError(true);
      return;
    }

    setShowError(false);

    const message = generateWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${storePhone}?text=${encoded}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={22} />
            <span>Keranjang Belanja</span>
            {totalItemCount > 0 && (
              <span className="cart-drawer-count">{totalItemCount} Item</span>
            )}
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Tutup keranjang"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-view animate-fade-in">
              <div className="cart-empty-icon">
                <Sprout size={38} />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--dark-green)', marginBottom: '0.4rem' }}>
                Keranjang Masih Kosong
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '240px' }}>
                Pilih sayur dan buah segar pilihan keluarga Anda untuk mulai berbelanja!
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                <span>Mulai Belanja</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="cart-items-list animate-fade-in">
              {cartItems.map((item) => {
                const prod = item.product;
                const pName = prod.name || prod.Name || 'Produk';
                const unit = getProductUnit(prod);
                const itemTotal = (prod.price || 0) * item.quantity;

                return (
                  <div key={prod.id} className="cart-item-row">
                    <img
                      src={getProductImage(prod)}
                      alt={pName}
                      className="cart-item-thumb"
                    />

                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{pName}</h4>
                      <div className="cart-item-unit-price">
                        {formatRupiah(prod.price)} / {unit}
                      </div>
                      <div className="cart-item-total-price">
                        {formatRupiah(itemTotal)}
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', background: 'transparent' }}
                        onClick={() => onRemoveItem(prod.id)}
                        title="Hapus dari keranjang"
                      >
                        <Trash2 size={15} color="#EF4444" />
                      </button>

                      <div className="qty-counter">
                        <button
                          type="button"
                          className="qty-btn"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => onUpdateQty(prod.id, -1)}
                          title="Kurangi"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="qty-number" style={{ minWidth: '22px', fontSize: '0.85rem' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="qty-btn"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => onUpdateQty(prod.id, 1)}
                          title="Tambah"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & WhatsApp Checkout Form */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Subtotal & Total */}
            <div className="cart-summary-row">
              <span>Jumlah Item:</span>
              <strong>{totalItemCount} item</strong>
            </div>
            <div className="cart-summary-total">
              <span>Total Belanja:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="cart-checkout-form">
              {showError && (
                <div className="form-alert-error" style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem' }}>
                  <AlertCircle size={15} />
                  <span>Nama & alamat pengiriman wajib diisi.</span>
                </div>
              )}

              <input
                type="text"
                className="cart-checkout-input"
                placeholder="Nama Anda (contoh: Budi)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <input
                type="text"
                className="cart-checkout-input"
                placeholder="Alamat Pengiriman (contoh: Jl. Dahlia No. 4)"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
              />

              <input
                type="text"
                className="cart-checkout-input"
                placeholder="Catatan pesanan (opsional)"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-wa"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
              >
                <Send size={18} />
                <span>Kirim Pesanan ke WhatsApp</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

