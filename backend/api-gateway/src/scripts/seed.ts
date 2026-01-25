// Database seed script for Aapda Setu
// Run with: npx ts-node src/scripts/seed.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Simple inline schemas for seeding
const ReportSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: { type: String, enum: ['fire', 'flood', 'earthquake', 'cyclone', 'landslide', 'other'] },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    status: { type: String, enum: ['pending', 'verified', 'rejected', 'resolved'], default: 'pending' },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    address: {
        formatted: String,
        city: String,
        state: String
    },
    reported_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verification_score: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const AlertSchema = new mongoose.Schema({
    type: { type: String, enum: ['fire', 'flood', 'earthquake', 'cyclone', 'other'] },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    status: { type: String, enum: ['active', 'resolved', 'expired'], default: 'active' },
    title: String,
    message: String,
    center: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    radius_km: Number,
    recipients_count: Number,
    created_at: { type: Date, default: Date.now },
    expires_at: Date
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    role: { type: String, enum: ['user', 'verifier', 'responder', 'ngo_admin', 'admin', 'superadmin'], default: 'user' },
    is_trusted: Boolean,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    created_at: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);
const Alert = mongoose.model('Alert', AlertSchema);
const User = mongoose.model('User', UserSchema);

const sampleReports = [
    {
        title: 'Building Fire in Connaught Place',
        description: 'Major fire broke out in a commercial building. Fire department has been notified.',
        type: 'fire',
        severity: 'high',
        status: 'verified',
        location: { type: 'Point', coordinates: [77.2167, 28.6304] },
        address: { formatted: 'Block A, Connaught Place, New Delhi', city: 'New Delhi', state: 'Delhi' },
        verification_score: 0.92
    },
    {
        title: 'Flash Flood Warning - Yamuna Banks',
        description: 'Water levels rising rapidly near Yamuna banks. Residents advised to evacuate.',
        type: 'flood',
        severity: 'critical',
        status: 'verified',
        location: { type: 'Point', coordinates: [77.2510, 28.6139] },
        address: { formatted: 'Yamuna Bank, Delhi', city: 'Delhi', state: 'Delhi' },
        verification_score: 0.95
    },
    {
        title: 'Landslide in Uttarakhand Highway',
        description: 'Landslide blocking NH-7 near Rishikesh. Vehicles stranded.',
        type: 'landslide',
        severity: 'high',
        status: 'pending',
        location: { type: 'Point', coordinates: [78.2676, 30.1158] },
        address: { formatted: 'NH-7 near Rishikesh', city: 'Rishikesh', state: 'Uttarakhand' },
        verification_score: 0.78
    },
    {
        title: 'Minor Earthquake Tremors - NCR Region',
        description: 'Minor earthquake of magnitude 3.2 felt across NCR region.',
        type: 'earthquake',
        severity: 'medium',
        status: 'verified',
        location: { type: 'Point', coordinates: [77.0266, 28.4595] },
        address: { formatted: 'Gurugram, Haryana', city: 'Gurugram', state: 'Haryana' },
        verification_score: 0.88
    },
    {
        title: 'Cyclone Approaching Odisha Coast',
        description: 'Cyclonic storm expected to make landfall in 48 hours. Red alert issued.',
        type: 'cyclone',
        severity: 'critical',
        status: 'verified',
        location: { type: 'Point', coordinates: [85.8245, 20.2961] },
        address: { formatted: 'Puri Coast', city: 'Puri', state: 'Odisha' },
        verification_score: 0.98
    }
];

const sampleAlerts = [
    {
        type: 'flood',
        severity: 'high',
        status: 'active',
        title: 'Flash Flood Warning - Mumbai',
        message: 'Heavy rainfall causing flooding in low-lying areas. Evacuate immediately to higher ground.',
        center: { type: 'Point', coordinates: [72.8777, 19.0760] },
        radius_km: 15,
        recipients_count: 125000,
        expires_at: new Date(Date.now() + 86400000 * 2)
    },
    {
        type: 'fire',
        severity: 'critical',
        status: 'active',
        title: 'Forest Fire Alert - Uttarakhand',
        message: 'Active forest fire spreading rapidly in Nainital region. Stay indoors and follow evacuation orders.',
        center: { type: 'Point', coordinates: [79.4636, 29.3919] },
        radius_km: 25,
        recipients_count: 45000,
        expires_at: new Date(Date.now() + 86400000)
    },
    {
        type: 'earthquake',
        severity: 'medium',
        status: 'resolved',
        title: 'Earthquake Aftershock Advisory - Delhi NCR',
        message: 'Minor aftershocks possible. Stay alert and keep emergency supplies ready.',
        center: { type: 'Point', coordinates: [77.2090, 28.6139] },
        radius_km: 50,
        recipients_count: 500000
    },
    {
        type: 'cyclone',
        severity: 'high',
        status: 'active',
        title: 'Cyclone Warning - Tamil Nadu Coast',
        message: 'Cyclonic storm approaching. Fishermen advised not to venture into sea.',
        center: { type: 'Point', coordinates: [80.2707, 13.0827] },
        radius_km: 100,
        recipients_count: 250000,
        expires_at: new Date(Date.now() + 86400000 * 3)
    }
];

const sampleUsers = [
    { name: 'Admin User', email: 'admin@aapdasetu.in', phone: '+919876543210', role: 'admin', is_trusted: true },
    { name: 'Verifier One', email: 'verifier1@aapdasetu.in', phone: '+919876543211', role: 'verifier', is_trusted: true },
    { name: 'Responder Team Lead', email: 'responder@aapdasetu.in', phone: '+919876543212', role: 'responder', is_trusted: true },
    { name: 'NGO Coordinator', email: 'ngo@aapdasetu.in', phone: '+919876543213', role: 'ngo_admin', is_trusted: true },
    { name: 'Citizen Reporter 1', email: 'user1@example.com', phone: '+919876543214', role: 'user', is_trusted: true },
    { name: 'Citizen Reporter 2', email: 'user2@example.com', phone: '+919876543215', role: 'user', is_trusted: false }
];

async function seedDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Aapda-Setu';
        console.log('Connecting to MongoDB:', mongoUri);

        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB');

        // Clear existing data
        await Report.deleteMany({});
        await Alert.deleteMany({});
        await User.deleteMany({});
        console.log('✓ Cleared existing data');

        // Insert users first
        const users = await User.insertMany(sampleUsers);
        console.log(`✓ Inserted ${users.length} users`);

        // Add user reference to reports
        const reportsWithUsers = sampleReports.map((report, index) => ({
            ...report,
            reported_by: users[index % users.length]._id
        }));

        // Insert reports
        const reports = await Report.insertMany(reportsWithUsers);
        console.log(`✓ Inserted ${reports.length} reports`);

        // Insert alerts
        const alerts = await Alert.insertMany(sampleAlerts);
        console.log(`✓ Inserted ${alerts.length} alerts`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\nSample data summary:');
        console.log(`  - Users: ${users.length}`);
        console.log(`  - Reports: ${reports.length}`);
        console.log(`  - Alerts: ${alerts.length}`);

        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
