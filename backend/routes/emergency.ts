import express from 'express';
import { GoogleGenAI } from "@google/genai";
import { Emergency } from '../models/Emergency';
import { Ambulance } from '../models/Ambulance';
import { Client } from "@googlemaps/google-maps-services-js";

const router = express.Router();
const mapsClient = new Client({});

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing in backend env");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

router.post('/request', async (req, res): Promise<any> => {
    try {
        const { patientId, location, emergencyType } = req.body;
        const { lat, lng } = location;

        // 1. Create Emergency Record
        const newEmergency = new Emergency({
            patientId,
            pickupLocation: { lat, lng },
            severity: 'High', // Logic to determine severity
            status: 'Pending'
        });
        await newEmergency.save();

        // 2. Find Nearest Ambulance
        const ambulances = await Ambulance.find({ isAvailable: true });
        let nearestAmbulance = null;
        let minDuration = Infinity;

        if (ambulances.length > 0) {
            const origins = ambulances.map(a => ({ lat: a.location?.lat!, lng: a.location?.lng! }));
            const destinations = [{ lat, lng }];

            try {
                const matrixRes = await mapsClient.distancematrix({
                    params: {
                        origins: origins,
                        destinations: destinations,
                        key: process.env.GOOGLE_MAPS_API_KEY!
                    }
                });

                // Parse results to find shortest duration
                matrixRes.data.rows.forEach((row, idx) => {
                    if (row.elements[0].status === 'OK') {
                        const durationVal = row.elements[0].duration.value; // seconds
                        if (durationVal < minDuration) {
                            minDuration = durationVal;
                            nearestAmbulance = ambulances[idx];
                        }
                    }
                });
            } catch (e) {
                console.error("Maps API Error", e);
            }
        }

        if (nearestAmbulance) {
            // Assign ambulance
            (nearestAmbulance as any).isAvailable = false;
            await (nearestAmbulance as any).save();
            newEmergency.ambulanceId = (nearestAmbulance as any)._id;
            newEmergency.status = 'Assigned';
            await newEmergency.save();
        }

        const io = req.app.get('socketio');
        io.emit('new_emergency', newEmergency); // Notify all drivers

        res.json({
            message: 'Emergency request received',
            emergencyId: newEmergency._id,
            status: 'Pending',
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to process emergency" });
    }
});

router.post('/guidance', async (req, res): Promise<any> => {
    try {
        const { emergencyType } = req.body;
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Provide immediate first aid steps for: ${emergencyType}. Be concise, use numbered lists, and prioritize life-saving actions.`,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (!text) throw new Error("No AI response");
        const result = JSON.parse(text);
        res.json(result);

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to fetch guidance" });
    }
});

export default router;
