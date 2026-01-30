import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'driver', 'admin', 'hospital'], default: 'user' },
    mobile: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
