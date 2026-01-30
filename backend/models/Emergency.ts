import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
    status: { type: String, enum: ['Pending', 'Assigned', 'EnRoute', 'PickedUp', 'Delivered', 'Cancelled'], default: 'Pending' },
    pickupLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    destinationHospital: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const Emergency = mongoose.model('Emergency', emergencySchema);
