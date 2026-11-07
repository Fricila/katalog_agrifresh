import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email dan password wajib diisi'
        });
    }

    const admin = db.getAdmin();

    if (!admin) {
        return res.status(401).json({
            success: false,
            message: 'Email atau Password salah'
        });
    }

    // Validate email
    if (email.trim().toLowerCase() !== admin.email.toLowerCase()) {
        return res.status(401).json({
            success: false,
            message: 'Email atau Password salah'
        });
    }

    // Validate password
    const isMatch = bcrypt.compareSync(password, admin.password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: 'Email atau Password salah'
        });
    }

    // Generate JWT token (expires in 24 hours)
    const token = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return res.json({
        success: true,
        message: 'Login berhasil',
        token,
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
        }
    });
});

// Verify token & get current profile
router.get('/me', authenticateToken, (req, res) => {
    const admin = db.getAdmin();

    if (!admin) {
        return res.status(404).json({
            success: false,
            message: 'Admin tidak ditemukan'
        });
    }

    res.json({
        success: true,
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email
        }
    });
});

// Update admin profile (name, email, password)
router.put('/me', authenticateToken, (req, res) => {
    const { name, email, password } = req.body;
    try {
        const updated = db.updateAdmin({ name, email, password });
        return res.json({
            success: true,
            message: 'Profil admin berhasil diperbarui',
            user: { id: updated.id, name: updated.name, email: updated.email }
        });
    } catch (err) {
        console.error('Update admin error:', err);
        return res.status(500).json({ success: false, message: 'Gagal memperbarui profil' });
    }
});

export default router;













