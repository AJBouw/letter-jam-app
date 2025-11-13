import { ErrorHandler } from './utils/error-handler.js'

export const QuickStartService = {
    async startQuickGame(data) {
        try {
            const res = await fetch('/games/quick-start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw {
                    message: responseData?.errorMessage || 'Failed to start quick game',
                    code: responseData?.errorCode || 'UNKNOWN_ERROR',
                    timestamp: responseData?.timestamp || new Date().toISOString()
                };
            }

            return responseData;

        } catch (err) {
            ErrorHandler.handle(err);
            throw err;
        }
    }
};