import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { db } from '../lib/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'snapvault-super-secret';

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

        const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (exists) return res.status(400).json({ error: 'Email already exists' });

        const hash = await bcrypt.hash(password, 10);
        const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
            .run(name, email, hash);

        const token = jwt.sign({ id: info.lastInsertRowid }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: info.lastInsertRowid, name, email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'All fields required' });

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (!user) {
            // Fake success for security
            return res.json({ success: true, message: 'If email exists, code sent.' });
        }

        const code = crypto.randomInt(100000, 999999).toString();
        const expires = Date.now() + 15 * 60 * 1000; // 15 mins
        db.prepare('UPDATE users SET reset_code = ?, reset_code_expires = ? WHERE id = ?')
            .run(code, expires, user.id);

        console.log(`\n\n[MOCK EMAIL] To: ${email} | Your reset code is: ${code}\n\n`);
        res.json({ success: true, message: 'Verification code sent to email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user || user.reset_code !== code || Date.now() > (user.reset_code_expires || 0)) {
            return res.status(400).json({ error: 'Invalid or expired code' });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        db.prepare('UPDATE users SET password_hash = ?, reset_code = NULL, reset_code_expires = NULL WHERE id = ?')
            .run(hash, user.id);

        res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Me (Get profile based on token)
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(decoded.id);
        if (!user) throw new Error('User not found');
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/me', requireAuth, (req, res) => {
    res.json({ success: true, user: req.user });
});

export default router;
