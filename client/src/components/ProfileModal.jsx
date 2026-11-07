import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Check } from 'lucide-react';

export const ProfileModal = ({ isOpen, onClose, onSave, profileForm, setProfileForm, profileError, profileSuccess }) => {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(e);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Ubah Profil Admin</h2>
          <button className="btn-icon" onClick={onClose} title="Tutup"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {profileError && (
              <div className="form-alert-error animate-fade-in">
                <AlertCircle size={18} />
                <span>{profileError}</span>
              </div>
            )}
            {profileSuccess && (
              <div className="form-alert-success animate-fade-in">
                <Check size={18} />
                <span>Profil berhasil diperbarui</span>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Nama</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={profileForm.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password Baru (opsional)</label>
              <input
                type="password"
                className="form-input"
                value={profileForm.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Kosongkan bila tidak diubah"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary"><Save size={16} /> <span>Simpan</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};

