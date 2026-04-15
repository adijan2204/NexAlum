const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        console.log('Register request received:', req.body);
        const { fullName, email, password, role, graduationYear, currentCompany, jobTitle, linkedIn, phone, college } = req.body;
        
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: 'Full Name, Email and Password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Registration failed: User exists', email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        // All new registrations (Student/Alumni) require admin approval
        const approvalStatus = false;

        const user = new User({
            fullName, email, password, role, graduationYear, currentCompany, jobTitle, linkedIn, phone, college,
            isApproved: approvalStatus
        });
        await user.save();
        console.log('User registered successfully:', email);
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful! Your account is waiting for admin approval.' 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isApproved) {
            return res.status(403).json({ message: 'Your account is pending approval by admin.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token, role: user.role, fullName: user.fullName });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

module.exports = router;
