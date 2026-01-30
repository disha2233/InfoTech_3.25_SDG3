
const testEndpoints = async () => {
    const baseUrl = 'http://localhost:3000/api';

    try {
        // 1. Test Root
        const rootRes = await fetch('http://localhost:3000/');
        console.log('Root:', await rootRes.text());

        // 2. Test Ambulance list
        const ambulancesRes = await fetch(`${baseUrl}/ambulance`);
        console.log('Ambulances:', await ambulancesRes.json());

        // 3. Test Auth Login
        const loginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        });
        console.log('Login:', await loginRes.json());

    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testEndpoints();
