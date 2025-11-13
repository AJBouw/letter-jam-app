export const ErrorHandler = {
    handle(error) {
        // Default logging
        if (error.timestamp) {
            console.error(`[${error.timestamp}] [${error.code || 'UNKNOWN'}] ${error.message}`);
        } else {
            console.error(error);
        }

        // Optional: display error to user (toast, modal, banner)
        // This could call a global UI component
        showErrorToUser(error.message || 'An unexpected error occurred');

        // Optional: send error to analytics / monitoring service
        // sendToMonitoring(error);
    }
};