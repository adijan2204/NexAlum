const express = require('express');
const Job = require('../models/Job');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify token (simplified)
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Post a job
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'alumni' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only alumni can post jobs' });
        }
        const { title, company, description, salary, location } = req.body;
        const job = new Job({
            title, company, description, salary, location,
            postedBy: req.user.id
        });
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'fullName');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
