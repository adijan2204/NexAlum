const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

const adminOnly = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get all alumni (for admin approval)
router.get('/alumni', adminOnly, async (req, res) => {
    try {
        const alumni = await User.find({ role: 'alumni' });
        res.json(alumni);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve user
router.put('/approve/:id', adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        res.json({ message: 'User approved', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile (for alumni)
router.put('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        
        const { bio, skills, experience, linkedIn } = req.body;
        const user = await User.findByIdAndUpdate(decoded.id, {
            bio, skills, experience, linkedIn
        }, { new: true });
        
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
