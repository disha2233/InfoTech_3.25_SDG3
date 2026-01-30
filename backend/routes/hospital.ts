import express from 'express';
import { Hospital } from '../models/Hospital';

const router = express.Router();

// Helper to generate random hospitals
const generateRandomHospitals = () => {
    const names = ['Tampa General', 'St. Josephs', 'Memorial Hospital', 'Kindred Hospital', 'AdventHealth'];
    return names.map((name, i) => ({
        _id: `mock-${i}`,
        name,
        location: {
            lat: 27.9478 + (Math.random() - 0.5) * 0.1,
            lng: -82.4584 + (Math.random() - 0.5) * 0.1,
            address: 'Tampa, FL'
        },
        capacity: ['Low', 'Medium', 'High', 'Full'][Math.floor(Math.random() * 4)],
        specialties: ['Trauma', 'Cardiac', 'General'],
        emergencyContact: '555-01' + Math.floor(10 + Math.random() * 90)
    }));
};

// Get all hospitals
router.get('/', async (req, res) => {
    try {
        let hospitals = await Hospital.find();
        if (hospitals.length === 0) {
            hospitals = generateRandomHospitals() as any;
        }
        res.json(hospitals);
    } catch (err) {
        console.error('DB Error, returning mock data:', err);
        res.json(generateRandomHospitals());
    }
});

router.get('/:id', async (req, res): Promise<any> => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (hospital) {
            res.json(hospital);
        } else {
            res.status(404).json({ message: 'Hospital not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
