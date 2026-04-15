const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Connection = require('../models/Connection');
const router = express.Router();
const auth = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminOnly = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
        next();
    });
};

// Get all pending users for admin approval
router.get('/pending', adminOnly, async (req, res) => {
    try {
        const users = await User.find({ isApproved: false });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all alumni
router.get('/alumni', auth, async (req, res) => {
    try {
        const alumni = await User.find({ role: 'alumni' });
        res.json(alumni);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send connection request
router.post('/connect', auth, async (req, res) => {
    try {
        const { alumnusId, message } = req.body;
        const studentId = req.user.id;

        const existing = await Connection.findOne({ student: studentId, alumnus: alumnusId });
        if (existing) return res.status(400).json({ message: 'Request already sent' });

        const connection = new Connection({ student: studentId, alumnus: alumnusId, message });
        await connection.save();
        res.json({ success: true, message: 'Request sent to alumnus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get pending requests for alumnus
router.get('/pending-requests', auth, async (req, res) => {
    try {
        if (req.user.role !== 'alumni') return res.status(403).json({ message: 'Only alumni can see requests' });
        const requests = await Connection.find({ alumnus: req.user.id, status: 'pending' })
            .populate('student', 'fullName email graduationYear');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Accept connection request
router.put('/accept-request/:id', auth, async (req, res) => {
    try {
        const connection = await Connection.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
        res.json({ success: true, message: 'Request accepted', connection });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve user (Admin)
router.put('/approve/:id', adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        res.json({ message: 'User approved', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { bio, skills, experience, linkedIn } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, {
            bio, skills, experience, linkedIn
        }, { new: true });
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

