/**
 * Admin Seeder Script
 * Usage: node backend/scripts/seedAdmin.js
 *
 * Creates (or updates) the default Admin account.
 * Credentials:
 *   Email:    admin@queuepro.com
 *   Password: Admin@123
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/queuepro';

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['Customer', 'ServiceProvider', 'Admin'], default: 'Customer' },
    phone:    { type: String },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const ADMIN = {
    name:     'System Admin',
    email:    'admin@queuepro.com',
    password: 'Admin@123',
    role:     'Admin',
    phone:    '+1 000 000 0000',
};

(async () => {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
        console.log(`Admin already exists: ${ADMIN.email}`);
        if (existing.role !== 'Admin') {
            existing.role = 'Admin';
            await existing.save();
            console.log('Role updated to Admin');
        }
    } else {
        const salt     = await bcrypt.genSalt(10);
        const hashed   = await bcrypt.hash(ADMIN.password, salt);
        await User.create({ ...ADMIN, password: hashed });
        console.log(`Admin account created: ${ADMIN.email} / ${ADMIN.password}`);
    }

    mongoose.disconnect();
    console.log('Done.');
})();
