const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const USER = import.meta.env.VITE_API_USERNAME; // Postman basic auth username
const PASS = import.meta.env.VITE_API_PASSWORD; // Postman basic auth password
const BASIC_AUTH = 'Basic ' + btoa(`${USER}:${PASS}`);

export async function startQuickGame(player) {
    console.log('Sending player:', player);
    const response = await fetch(`${API_BASE}/game/quick-start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': BASIC_AUTH
        },
        body: JSON.stringify(player)
    });

    if (!response.ok) {
        const text = await response.text(); // get raw response
        throw new Error(`Failed to start game: ${text}`);
    }

    // Only parse JSON if response has content
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}