import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Ambulance } from './models/Ambulance';
import { Hospital } from './models/Hospital';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emergency-life-alert';

const tampaCenter = { lat: 27.9478, lng: -82.4584 };

const randomLocation = (center: { lat: number, lng: number }, radius: number) => {
    const r = radius / 111300; // radius in meters converted to degrees approx
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);
    return {
        lat: center.lat + y,
        lng: center.lng + x / Math.cos(center.lat)
    };
};

const hospitals = [
    { name: 'Tampa General Hospital', specialties: ['Trauma', 'Cardiac', 'Burn'] },
    { name: 'St. Joseph\'s Hospital', specialties: ['Pediatric', 'General'] },
    { name: 'Memorial Hospital of Tampa', specialties: ['Emergency', 'Orthopedic'] },
    { name: 'HCA Florida South Tampa', specialties: ['Surgical', 'General'] },
    { name: 'AdventHealth Tampa', specialties: ['Cardiac', 'Neurology'] }
];

const ambulanceTypes = ['Basic', 'Advance', 'ICU'];

const runSeed = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Clear existing
        await Ambulance.deleteMany({});
        await Hospital.deleteMany({});
        console.log('Cleared existing data');

        // Seed Hospitals
        const hospitalDocs = hospitals.map(h => ({
            name: h.name,
            location: { ...randomLocation(tampaCenter, 5000), address: 'Tampa, FL' }, // 5km radius
            capacity: Math.random() > 0.8 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low',
            specialties: h.specialties,
            emergencyContact: '813-555-' + Math.floor(1000 + Math.random() * 9000),
        }));
        await Hospital.insertMany(hospitalDocs);
        console.log(`Seeded ${hospitalDocs.length} hospitals`);

        // Seed Ambulances
        const ambulanceDocs = Array.from({ length: 10 }).map((_, i) => ({
            plateNumber: `AMB-${100 + i}`,
            isAvailable: Math.random() > 0.2, // 80% available
            location: randomLocation(tampaCenter, 8000), // 8km radius
            type: ambulanceTypes[Math.floor(Math.random() * ambulanceTypes.length)],
            equippedFor: ['Trauma', 'Basic'],
        }));
        await Ambulance.insertMany(ambulanceDocs);
        console.log(`Seeded ${ambulanceDocs.length} ambulances`);

        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

runSeed();
