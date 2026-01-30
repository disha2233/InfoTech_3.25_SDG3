import express from 'express';
import { Ambulance } from '../models/Ambulance';

const router = express.Router();

// Helper to generate random ambulances
const generateRandomAmbulances = () => {
    return Array.from({ length: 15 }).map((_, i) => ({
        _id: `mock-amb-${i}`,
        driverName: `Driver ${i + 1}`,
        plateNumber: `AMB-${100 + i}`,
        isAvailable: Math.random() > 0.2,
        location: {
            lat: 27.9478 + (Math.random() - 0.5) * 0.15,
            lng: -82.4584 + (Math.random() - 0.5) * 0.15
        },
        type: ['Basic', 'Advance', 'ICU'][Math.floor(Math.random() * 3)],
        equippedFor: ['Trauma', 'Basic'],
        rating: (3 + Math.random() * 2).toFixed(1),
        eta: Math.floor(Math.random() * 15) + ' mins'
    }));
};

// Get all ambulances
router.get('/', async (req, res) => {
    try {
        let ambulances = await Ambulance.find();
        if (ambulances.length === 0) {
            ambulances = generateRandomAmbulances() as any;
        }
        res.json(ambulances);
    } catch (err) {
        console.error('DB Error, returning mock data:', err);
        res.json(generateRandomAmbulances());
    }
});

router.get('/:id', async (req, res): Promise<any> => {
    try {
        const ambulance = await Ambulance.findById(req.params.id);
        if (ambulance) {
            res.json(ambulance);
        } else {
            res.status(404).json({ message: 'Ambulance not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update location
router.post('/location', async (req, res): Promise<any> => {
    try {
        const { ambulanceId, lat, lng } = req.body;
        const ambulance = await Ambulance.findByIdAndUpdate(ambulanceId, {
            location: { lat, lng }
        }, { new: true });

        if (!ambulance) return res.status(404).json({ message: "Ambulance not found" });

        // Emit socket event (access io from app)
        const io = req.app.get('socketio');
        io.to('dispatch_center').emit('ambulance_location_update', { ambulanceId, lat, lng });

        res.json({ message: "Location updated", ambulance });

    } catch (err) {
        res.status(500).json({ message: "Update failed" });
    }
});

export default router;
