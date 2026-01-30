export const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
    get: async (endpoint: string) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!res.ok) throw new Error('API Error');
        return res.json();
    },
    post: async (endpoint: string, body: any) => {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('API Error');
        return res.json();
    }
};
