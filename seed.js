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

        // Create Static Users for Testing (Same as app.js)
        const staticUsers = [
            { 
                fullName: 'System Admin', 
                email: 'shruti@1007.com', 
                password: 'shruti', 
                role: 'admin', 
                isApproved: true 
            },
            { 
                fullName: 'Vaishanavi Maraskolhe', 
                email: 'vaishu@0910.com', 
                password: 'vaishu', 
                role: 'alumni', 
                isApproved: true,
                graduationYear: 2026,
                currentCompany: 'Meta',
                jobTitle: 'UI/UX Designer',
                bio: 'Designing premium experiences.',
                skills: ['Figma', 'UI Design']
            },
            { 
                fullName: 'Mansi Mate', 
                email: 'mansi@1007.com', 
                password: 'mansi', 
                role: 'student', 
                isApproved: true 
            }
        ];

        for (const u of staticUsers) {
            const user = new User(u);
            await user.save();
        }

        // Create Avengers Alumni
        const alums = [
            { fullName: 'Tony Stark', email: 'tony@stark.com', password: 'ironman', role: 'alumni', isApproved: true, graduationYear: 2008, currentCompany: 'Stark Industries', jobTitle: 'CEO' },
            { fullName: 'Steve Rogers', email: 'steve@rogers.com', password: 'cap', role: 'alumni', isApproved: true, graduationYear: 1941, currentCompany: 'US Army', jobTitle: 'Captain' }
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
