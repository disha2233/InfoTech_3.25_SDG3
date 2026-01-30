import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    capacity: { type: String, enum: ['Low', 'Medium', 'High', 'Full'], default: 'Medium' },
    specialties: [{ type: String }], // e.g., "Trauma", "Burn", "Pediatric"
    emergencyContact: { type: String },
    isActive: { type: Boolean, default: true }
});

export const Hospital = mongoose.model('Hospital', hospitalSchema);
