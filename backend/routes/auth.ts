import express from 'express';
import { User } from '../models/User';

const router = express.Router();

router.post('/login', async (req, res): Promise<any> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) { // In prod, use bcrypt
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            token: 'mock-token', // In prod, use JWT
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            redirect: user.role === 'driver' ? '/ambulance-dashboard' : '/patient-dashboard'
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signup', async (req, res): Promise<any> => {
    try {
        const { email, password, name, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ email, password, name, role });
        await newUser.save();

        res.json({
            token: 'mock-token',
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            },
            redirect: role === 'driver' ? '/ambulance-dashboard' : '/patient-dashboard'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error', error: (err as any).message });
    }
});

export default router;
