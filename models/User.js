const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
    phone: { type: String },
    college: { type: String },
    graduationYear: { type: Number },
    currentCompany: { type: String },
    jobTitle: { type: String },
    linkedIn: { type: String },
    bio: { type: String },
    skills: [String],
    experience: [{
        company: String,
        role: String,
        duration: String
    }],
    education: [{
        school: String,
        degree: String,
        year: Number
    }],
    // Admin stuff
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
