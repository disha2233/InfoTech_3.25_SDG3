import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema({
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plateNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    type: { type: String, enum: ['Basic', 'ICU', 'Advance'], default: 'Basic' },
    equippedFor: [{ type: String }], // e.g. "Cardiac", "Trauma"
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Linked hospital
});

export const Ambulance = mongoose.model('Ambulance', ambulanceSchema);
