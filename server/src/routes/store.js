import express from 'express'
import { db } from '../db/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET store settings (public)
router.get('/', (req, res) => {
    const settings = db.getSettings();
    res.json({
        success: true,
        data: settings
    });
});

// PUT update store settings (admin protected)
router.put('/', authenticateToken, (req, res) => {
    const { storeName, tagline, phone, address } = req.body;

    const current = db.getSettings();
    const update = db.updateSettings({
        storeName: storeName !== undefined ? storeName.trim() : current.storeName,
        tagline: tagline !== undefined ? tagline.trim() : current.tagline,
        phone: phone ? phone.replace(/[^0-9]/g, '') : current.phone,
        address: address !== undefined ? address.trim() : current.address
    });

    res.json({
        success: true,
        message: 'Pengaturan toko berhasil disimpan',
        data: update
    });
});

export default router;
