import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Save, AlertCircle, Check } from 'lucide-react';
import { getImageUrl, DEFAULT_PRODUCT_IMAGE } from '../utils/imageHelper';

const PRESET_GROCERY_IMAGES = [
  { label: 'Pakcoy', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wortel', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=800&q=80' },
  { label: 'Apel Fuji', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jeruk Manis', url: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Anggur', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Mangga', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80' },
  { label: 'Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' }
];

export const ProductFormModal = ({ isOpen, onClose, onSave, editingProduct, categories = [] }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [stockStatus, setStockStatus] = useState('Tersedia');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (editingProduct) {
      setName(editingProduct.name || editingProduct.Name || '');
      setCategoryId(editingProduct.categoryId || editingProduct.category_id || (categories[0]?.id || 'cat-1'));
      setPrice(editingProduct.price !== undefined ? String(editingProduct.price) : '');
      setUnit(editingProduct.unit || 'kg');
      const initialQty = editingProduct.stockQuantity !== undefined 
        ? String(editingProduct.stockQuantity) 
        : (editingProduct.stock_quantity !== undefined ? String(editingProduct.stock_quantity) : '10');
      setStockQuantity(initialQty);
      const initialStatus = editingProduct.stockStatus || editingProduct.stock_status || (Number(initialQty) > 0 ? 'Tersedia' : 'Habis');
      setStockStatus(initialStatus);
      setDescription(editingProduct.description || '');
      const existingImg = getImageUrl(editingProduct.image || editingProduct.imageUrl || '');
      setImageUrl(existingImg);
      setPreviewSrc(existingImg);
      setSelectedFile(null);
    } else {
      setName('');
      setCategoryId(categories[0]?.id || 'cat-1');
      setPrice('');
      setUnit('kg');
      setStockQuantity('10');
      setStockStatus('Tersedia');
      setDescription('');
      const defaultImg = PRESET_GROCERY_IMAGES[0]?.url || DEFAULT_PRODUCT_IMAGE;
      setImageUrl(defaultImg);
      setPreviewSrc(defaultImg);
      setSelectedFile(null);
    }
    setErrorMsg('');
  }, [isOpen, editingProduct]);

  if (!isOpen) return null;

  // Handle file picker from computer file explorer
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Ukuran file foto maksimal 5 MB.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');

      // Read file as Data URL (Base64) for instant, persistent client-side preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setPreviewSrc(base64Url);
        setImageUrl(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle preset image click
  const handleSelectPreset = (url) => {
    setSelectedFile(null);
    setImageUrl(url);
    setPreviewSrc(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama produk wajib diisi.');
      return;
    }
    if (!categoryId) {
      setErrorMsg('Kategori produk wajib dipilih.');
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      setErrorMsg('Harga produk harus angka positif.');
      return;
    }

    const parsedQty = stockQuantity !== '' ? Number(stockQuantity) : 0;
    if (isNaN(parsedQty) || parsedQty < 0) {
      setErrorMsg('Jumlah stok harus berupa angka minimal 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalStockStatus = stockStatus || (parsedQty > 0 ? 'Tersedia' : 'Habis');
      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('categoryId', categoryId);
        payload.append('price', String(price));
        payload.append('unit', unit || 'kg');
        payload.append('stockQuantity', String(parsedQty));
        payload.append('stockStatus', finalStockStatus);
        payload.append('description', description.trim());
        payload.append('photo', selectedFile);
        // Do not pass base64 previewSrc as imageUrl so backend uses uploaded file
      } else {
        payload = {
          name: name.trim(),
          categoryId,
          price: Number(price),
          unit: unit || 'kg',
          stockQuantity: parsedQty,
          stockStatus: finalStockStatus,
          description: description.trim(),
          imageUrl: previewSrc || imageUrl
        };
      }

      await onSave(payload, editingProduct?.id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">
              {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
            </h2>
            <p className="modal-subtitle">
              Lengkapi data sayur & buah segar untuk katalog toko
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} title="Tutup">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div className="form-alert-error animate-fade-in">
                <AlertCircle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Product Image Preview & Selector */}
            <div className="product-form-media-section">
              <div className="media-preview-box">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="media-preview-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="media-placeholder">
                    <ImageIcon size={32} />
                    <span>Belum ada foto</span>
                  </div>
                )}
              </div>

              <div className="media-controls">
                <label
                  htmlFor="product-file-picker"
                  className="btn btn-secondary btn-sm upload-file-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                >
                  <Upload size={15} />
                  <span>Upload Foto dari Komputer</span>
                </label>
                <input
                  id="product-file-picker"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg,image/gif,image/*"
                  onChange={handleFileChange}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0
                  }}
                />

                {selectedFile && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', fontSize: '0.82rem', color: '#059669', fontWeight: 600 }}>
                    <Check size={14} />
                    <span>File siap: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        const fallbackImg = editingProduct?.image || PRESET_GROCERY_IMAGES[0].url;
                        setPreviewSrc(fallbackImg);
                        setImageUrl(fallbackImg);
                      }}
                      style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        cursor: 'pointer',
                        fontSize: '0.75rem'
                      }}
                      title="Batalkan file ini"
                    >
                      Batal
                    </button>
                  </div>
                )}

                <div className="preset-images-row">
                  <span className="preset-label">Atau pilih sampel sayur & buah:</span>
                  <div className="preset-thumbs">
                    {PRESET_GROCERY_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`preset-thumb-btn ${previewSrc === preset.url ? 'active' : ''}`}
                        onClick={() => handleSelectPreset(preset.url)}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div className="form-group">
              <label className="form-label">
                <span>Nama Produk</span>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="cth: Pakcoy Premium, Apel Fuji, Wortel Segar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Category, Price, and Unit Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Kategori</span>
                  <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Satuan Produk</span>
                  <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="ikat">ikat</option>
                  <option value="pack">pack</option>
                  <option value="pcs">pcs / buah</option>
                  <option value="bowl">bowl (Salad)</option>
                  <option value="sisir">sisir (Pisang)</option>
                  <option value="gram">gram</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Harga (Rp)</span>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="cth: 15000"
                  min="0"
                  step="500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Jumlah Stok ({unit})</span>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="cth: 25"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStockQuantity(val);
                    if (Number(val) === 0) {
                      setStockStatus('Habis');
                    } else if (Number(val) > 0 && stockStatus === 'Habis') {
                      setStockStatus('Tersedia');
                    }
                  }}
                  required
                />
              </div>
            </div>

            {/* Stock Status Selector */}
            <div className="form-group">
              <label className="form-label">
                <span>Status Stok</span>
              </label>
              <div className="stock-radio-group">
                <label className={`stock-radio-card ${stockStatus === 'Tersedia' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="stockStatus"
                    value="Tersedia"
                    checked={stockStatus === 'Tersedia'}
                    onChange={() => {
                      setStockStatus('Tersedia');
                      if (Number(stockQuantity) <= 0) {
                        setStockQuantity('1');
                      }
                    }}
                  />
                  <div>
                    <strong>Tersedia</strong>
                    <p>Produk aktif dan dapat dipesan pelanggan</p>
                  </div>
                </label>

                <label className={`stock-radio-card ${stockStatus === 'Habis' ? 'selected-out' : ''}`}>
                  <input
                    type="radio"
                    name="stockStatus"
                    value="Habis"
                    checked={stockStatus === 'Habis'}
                    onChange={() => {
                      setStockStatus('Habis');
                      setStockQuantity('0');
                    }}
                  />
                  <div>
                    <strong>Stok Habis</strong>
                    <p>Tombol pemesanan dinonaktifkan di katalog</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <span>Deskripsi Produk</span>
              </label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Jelaskan kualitas, kesegaran, asal kebun, atau manfaat produk ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
