
const testFullStack = async () => {
    const baseUrl = 'http://localhost:3000/api';

    try {
        console.log('--- Starting Verification ---');

        // 1. Test Root
        const rootRes = await fetch('http://localhost:3000/');
        console.log('Root:', await rootRes.text());

        // 2. Auth: Signup
        const uniqueEmail = `test_${Date.now()}@example.com`;
        console.log(`\n--- Testing Signup (${uniqueEmail}) ---`);
        const signupRes = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: uniqueEmail,
                password: 'password123',
                name: 'Test User',
                role: 'user'
            })
        });
        const signupData = await signupRes.json();
        console.log('Signup Result:', signupData);

        if (signupData.user) {
            // 3. Auth: Login
            console.log('\n--- Testing Login ---');
            const loginRes = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: uniqueEmail, password: 'password123' })
            });
            console.log('Login Result:', await loginRes.json());

            // 4. Create Emergency
            console.log('\n--- Testing Emergency Request ---');
            const emergencyRes = await fetch(`${baseUrl}/emergency/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: signupData.user.id,
                    location: { lat: 40.7128, lng: -74.0060 },
                    emergencyType: 'Cardiac Arrest'
                })
            });
            console.log('Emergency Request:', await emergencyRes.json());
        }

        // 5. Check Ambulances (Empty DB initially)
        console.log('\n--- Testing Ambulance List ---');
        const ambulancesRes = await fetch(`${baseUrl}/ambulance`);
        console.log('Ambulances:', await ambulancesRes.json());

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testFullStack();
