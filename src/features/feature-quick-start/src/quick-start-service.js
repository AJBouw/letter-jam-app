export const QuickStartService = {
    async startQuickGame(data) {
        const res = await fetch('/games/quick-start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Failed to start quick game');
        return await res.json();
    }
};