import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle, Send, Check, ShoppingBag, Plus, Minus } from 'lucide-react';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageHelper';
import { createOrder } from '../services/api';

export const OrderModal = ({ product, storeSettings, onClose, onAddToCart }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerNotes, setCustomerNotes] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [showError, setShowError] = useState(false);
    const [isAddedToCartFeedback, setIsAddedToCartFeedback] = useState(false);

    if (!product) return null;

    const displayImage = getImageUrl(product.image);
    const productName = product.name || product.Name || 'Produk';

    const storeName = storeSettings?.storeName || 'Toko Agri Fresh';
    const storePhone = (storeSettings?.phone || '6281234567890').replace(/[^0-9]/g, '');

    const productUnit = product.unit || (
        product.categoryName === 'Sayuran' ? 'ikat' :
        product.categoryName?.toLowerCase().includes('salad') ? 'bowl' :
        product.name?.toLowerCase().includes('pisang') ? 'sisir' : 'kg'
    );

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(num) || 0);
    };

    const totalPrice = (product.price || 0) * quantity;

    // Build formatted WhatsApp message
    const generateMessage = () => {
        const nameStr = customerName.trim() || '[Nama Pemesan]';
        const phoneStr = customerPhone.trim() || '-';
        const addrStr = customerAddress.trim() || '-';
        const notesStr = customerNotes.trim() || '-';

        return `Halo ${storeName}! Saya ingin memesan:

🛒 *RINCIAN PESANAN:*
- *Produk:* ${productName}
- *Jumlah:* ${quantity} ${productUnit}
- *Harga Satuan:* ${formatRupiah(product.price)}
- *Total Pembayaran:* ${formatRupiah(totalPrice)}

👤 *DATA PENGIRIMAN:*
- *Nama Pemesan:* ${nameStr}
- *No. WhatsApp / HP:* ${phoneStr}
- *Alamat Pengiriman:* ${addrStr}
- *Catatan:* ${notesStr}

Mohon konfirmasi ketersediaan & ongkos kirimnya. Terima kasih!`;
    };

    // Handle adding to cart from modal
    const handleAddDirectToCart = () => {
        if (onAddToCart) {
            onAddToCart(product, quantity);
            setIsAddedToCartFeedback(true);
            setTimeout(() => {
                setIsAddedToCartFeedback(false);
                onClose();
            }, 1000);
        }
    };

    // Handle WhatsApp submission with validation check & save to DB
    const handleSubmitOrder = (e) => {
        e.preventDefault();

        // Validate name and address
        if (!customerName.trim() || !customerAddress.trim()) {
            setShowError(true);
            const input = !customerName.trim()
                ? document.getElementById('customer-name-input')
                : document.getElementById('customer-address-input');
            if (input) input.focus();
            return;
        }

        setShowError(false);

        // Save order to backend DB for Admin Order History
        try {
            const orderItems = [{
                productId: product.id,
                productName: productName,
                quantity: quantity,
                unit: productUnit,
                price: product.price || 0,
                subtotal: totalPrice
            }];

            createOrder({
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerAddress: customerAddress.trim(),
                customerNotes: customerNotes.trim(),
                items: orderItems,
                totalPrice: totalPrice
            }).catch((err) => {
                console.warn('Gagal menyimpan pesanan langsung ke server:', err);
            });
        } catch (err) {
            console.warn('Error saat menyiapkan pesanan:', err);
        }

        // Final clean message for redirect
        const finalMessage = generateMessage();
        const encodedText = encodeURIComponent(finalMessage);
        const waUrl = `https://wa.me/${storePhone}?text=${encodedText}`;

        // Redirect user directly to WhatsApp
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-content animate-slide-up"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '540px' }}
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="modal-title-group">
                        <h2 className="modal-title">Konfirmasi Pesanan WhatsApp</h2>
                        <p className="modal-subtitle">Pesan langsung ke WhatsApp {storeName}</p>
                    </div>
                    <button className="btn-icon" onClick={onClose} title="Tutup">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmitOrder}>
                    <div className="modal-body">
                        {/* Selected Product Summary Box */}
                        <div className="order-product-summary">
                            <img
                                src={displayImage}
                                alt={productName}
                                className="summary-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
                                }}
                            />
                            <div className="summary-details">
                                <span className="summary-category">{product.categoryName}</span>
                                <h4 className="summary-name">{productName}</h4>
                                <div className="summary-price-row">
                                    <span className="summary-unit-price">{formatRupiah(product.price)} / {productUnit}</span>
                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            className="qty-btn"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="qty-number">{quantity}</span>
                                        <button
                                            type="button"
                                            className="qty-btn"
                                            onClick={() => {
                                                const maxStock = product.stockQuantity !== undefined ? Number(product.stockQuantity) : null;
                                                if (maxStock !== null && maxStock > 0 && quantity >= maxStock) {
                                                    return;
                                                }
                                                setQuantity(quantity + 1);
                                            }}
                                            disabled={product.stockQuantity !== undefined && Number(product.stockQuantity) > 0 && quantity >= Number(product.stockQuantity)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                {product.stockQuantity !== undefined && (
                                    <div style={{ fontSize: '0.78rem', color: Number(product.stockQuantity) > 0 ? '#16A34A' : '#DC2626', marginTop: '0.35rem', fontWeight: 600 }}>
                                        {Number(product.stockQuantity) > 0 ? `Sisa stok tersedia: ${product.stockQuantity} ${productUnit}` : 'Stok habis'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total Price Banner */}
                        <div className="order-total-bar">
                            <span>Total Perkiraan:</span>
                            <span className="total-amount">{formatRupiah(totalPrice)}</span>
                        </div>

                        {/* Validation Error Alert if Name or Address missing */}
                        {showError && (
                            <div className="form-alert-error animate-fade-in" id="name-validation-alert">
                                <AlertCircle size={18} />
                                <span>Nama dan Alamat pengiriman wajib diisi untuk memesan.</span>
                            </div>
                        )}

                        {/* Input: Customer Name */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="customer-name-input">
                                <span>Nama Lengkap Anda</span>
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                id="customer-name-input"
                                type="text"
                                className={`form-input ${showError && !customerName.trim() ? 'error' : ''}`}
                                placeholder="Contoh: Budi Pratama"
                                value={customerName}
                                onChange={(e) => {
                                    setCustomerName(e.target.value);
                                    if (e.target.value.trim() && customerAddress.trim()) setShowError(false);
                                }}
                                autoFocus
                            />
                        </div>

                        {/* Input: Customer Phone */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="customer-phone-input">
                                <span>No. WhatsApp / HP</span>
                                <span className="text-muted" style={{ fontWeight: 400 }}>(Opsional)</span>
                            </label>
                            <input
                                id="customer-phone-input"
                                type="tel"
                                className="form-input"
                                placeholder="Contoh: 08123456789"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                            />
                        </div>

                        {/* Input: Delivery Address */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="customer-address-input">
                                <span>Alamat Pengiriman Lengkap</span>
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                id="customer-address-input"
                                rows="2"
                                className={`form-textarea ${showError && !customerAddress.trim() ? 'error' : ''}`}
                                placeholder="Contoh: Jl. Anggrek No. 12, RT 02/RW 04, Kelurahan Sukasari"
                                value={customerAddress}
                                onChange={(e) => {
                                    setCustomerAddress(e.target.value);
                                    if (customerName.trim() && e.target.value.trim()) setShowError(false);
                                }}
                            />
                        </div>

                        {/* Input: Special Notes */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="customer-notes-input">
                                <span>Catatan Tambahan</span>
                                <span className="text-muted" style={{ fontWeight: 400 }}>(Opsional)</span>
                            </label>
                            <input
                                id="customer-notes-input"
                                type="text"
                                className="form-input"
                                placeholder="Contoh: Pilih yang matang, kirim sebelum jam 12 siang"
                                value={customerNotes}
                                onChange={(e) => setCustomerNotes(e.target.value)}
                            />
                        </div>

                        {/* Live WhatsApp Message Preview Bubble */}
                        <div className="wa-preview-box">
                            <div className="wa-preview-header">
                                <MessageCircle size={16} />
                                <span>PREVIEW PESAN WHATSAPP OTOMATIS:</span>
                            </div>
                            <div className="wa-bubble">
                                {generateMessage()}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {onAddToCart ? (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleAddDirectToCart}
                                title="Masukkan ke keranjang belanja"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <ShoppingBag size={16} />
                                <span>{isAddedToCartFeedback ? '✓ Masuk Keranjang' : '+ Ke Keranjang'}</span>
                            </button>
                        ) : (
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Batal
                            </button>
                        )}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {onAddToCart && (
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Tutup
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn btn-wa"
                                id="submit-wa-order-btn"
                            >
                                <Send size={16} />
                                <span>Checkout Langsung</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};