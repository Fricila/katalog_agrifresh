import React from 'react';
import { X, Calendar, User, Phone, MapPin, FileText, ShoppingBag, CheckCircle2, Clock, Truck, AlertCircle, Trash2 } from 'lucide-react';

export const OrderDetailModal = ({ order, onClose, onUpdateStatus, onDelete }) => {
  if (!order) return null;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      let normalized = String(dateStr);
      if (normalized.includes(' ') && !normalized.includes('T')) {
        normalized = normalized.replace(' ', 'T') + 'Z';
      }
      const d = new Date(normalized);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return String(dateStr);
    } catch {
      return String(dateStr);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Diproses':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'Dikirim':
        return { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' };
      case 'Selesai':
        return { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' };
      case 'Dibatalkan':
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
      default:
        return { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A' };
    }
  };

  const statusStyle = getStatusColor(order.status);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '92%' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <ShoppingBag size={20} color="#16A34A" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Detail Pesanan</h3>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontFamily: 'monospace' }}>ID: {order.id}</span>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1.25rem' }}>
          {/* Status & Date Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.85rem 1rem',
            background: '#F8FAFC',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
              <Calendar size={16} />
              <span>{formatDate(order.created_at || order.createdAt)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Status:</span>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus && onUpdateStatus(order.id, e.target.value)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: statusStyle.bg,
                  color: statusStyle.text,
                  border: `1px solid ${statusStyle.border}`,
                  cursor: 'pointer'
                }}
              >
                <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                <option value="Diproses">Diproses</option>
                <option value="Dikirim">Dikirim</option>
                <option value="Selesai">Selesai</option>
                <option value="Dibatalkan">Dibatalkan</option>
              </select>
            </div>
          </div>

          {/* Customer Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ padding: '0.85rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#16A34A', fontWeight: 600, fontSize: '0.85rem' }}>
                <User size={16} />
                <span>Nama Pemesan</span>
              </div>
              <p style={{ margin: 0, fontWeight: 600, color: '#1E293B', fontSize: '0.95rem' }}>
                {order.customer_name || order.customerName || '-'}
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#16A34A', fontWeight: 600, fontSize: '0.85rem' }}>
                <Phone size={16} />
                <span>No. WhatsApp / HP</span>
              </div>
              <p style={{ margin: 0, color: '#1E293B', fontSize: '0.95rem' }}>
                {order.customer_phone || order.customerPhone ? (
                  <a
                    href={`https://wa.me/${(order.customer_phone || order.customerPhone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#059669', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    {order.customer_phone || order.customerPhone}
                  </a>
                ) : (
                  <span style={{ color: '#94A3B8' }}>Tidak diisi</span>
                )}
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#16A34A', fontWeight: 600, fontSize: '0.85rem' }}>
                <MapPin size={16} />
                <span>Alamat Pengiriman</span>
              </div>
              <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.4 }}>
                {order.customer_address || order.customerAddress || '-'}
              </p>
            </div>

            {(order.customer_notes || order.customerNotes) && (
              <div style={{ padding: '0.85rem', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', gridColumn: '1 / -1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', color: '#B45309', fontWeight: 600, fontSize: '0.85rem' }}>
                  <FileText size={16} />
                  <span>Catatan Khusus</span>
                </div>
                <p style={{ margin: 0, color: '#78350F', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  "{order.customer_notes || order.customerNotes}"
                </p>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.65rem' }}>
              Rincian Item Produk ({items.length})
            </h4>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <tr>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Produk</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 600, color: '#475569' }}>Jumlah</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Harga</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 600, color: '#475569' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#94A3B8' }}>
                        Tidak ada rincian item
                      </td>
                    </tr>
                  ) : (
                    items.map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < items.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                        <td style={{ padding: '0.65rem 0.85rem', fontWeight: 500, color: '#1E293B' }}>
                          {it.productName || it.name || 'Produk'}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: '#475569' }}>
                          {it.quantity} {it.unit || ''}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#475569' }}>
                          {formatRupiah(it.price)}
                        </td>
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>
                          {formatRupiah(it.subtotal || ((it.price || 0) * (it.quantity || 1)))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '8px'
          }}>
            <span style={{ fontWeight: 600, color: '#166534', fontSize: '1rem' }}>Total Pembayaran:</span>
            <span style={{ fontWeight: 800, color: '#15803D', fontSize: '1.25rem' }}>
              {formatRupiah(order.total_price || order.totalPrice || 0)}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {onDelete ? (
            <button
              type="button"
              className="btn btn-danger-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626' }}
              onClick={() => {
                onDelete(order);
                onClose();
              }}
            >
              <Trash2 size={16} />
              <span>Hapus Pesanan</span>
            </button>
          ) : <div />}

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

