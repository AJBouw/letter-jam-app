const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USER = import.meta.env.VITE_API_USERNAME || 'user';
const PASS = import.meta.env.VITE_API_PASSWORD || 'pass';
const BASIC_AUTH = 'Basic ' + btoa(`${USER}:${PASS}`);

export async function post(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': BASIC_AUTH
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API POST ${endpoint} failed: ${text}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export async function get(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Authorization': BASIC_AUTH
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API GET ${endpoint} failed: ${text}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}