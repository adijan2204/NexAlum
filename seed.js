const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_db';

const seedData = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to seed database...');

        // Clear existing data
        await User.deleteMany({});
        await Job.deleteMany({});

        // Create Admin
        const admin = new User({
            fullName: 'System Admin',
            email: 'admin@nexalum.com',
            password: 'password123',
            role: 'admin',
            isApproved: true
        });
        await admin.save();

        // Create Alumni
        const alums = [
            { fullName: 'John Doe', email: 'john@example.com', password: 'password123', role: 'alumni', isApproved: true, graduationYear: 2018, currentCompany: 'Google', jobTitle: 'Senior Dev' },
            { fullName: 'Alice Smith', email: 'alice@example.com', password: 'password123', role: 'alumni', isApproved: true, graduationYear: 2015, currentCompany: 'Meta', jobTitle: 'PM' }
        ];

        const savedAlums = await User.insertMany(alums);

        // Create Jobs
        const jobs = [
            { title: 'Frontend Intern', company: 'Google', description: 'Join our UI team.', salary: '$5000/mo', postedBy: savedAlums[0]._id },
            { title: 'Backend Engineer', company: 'Stripe', description: 'Work on payments infrastructure.', salary: '$120k/yr', postedBy: savedAlums[1]._id }
        ];

        await Job.insertMany(jobs);

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
