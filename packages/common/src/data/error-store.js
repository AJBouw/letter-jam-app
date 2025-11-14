import { signal } from '@preact/signals';

/**
 * Reactive signals for current game state
 */
export const errorStore = {
    global: signal(null),
    apiErrors: signal({}),

    set(key, message) {
        this.apiErrors.value = { ...this.apiErrors.value, [key]: message };
    },

    clear(key) {
        const newErrors = { ...this.apiErrors.value };
        delete newErrors[key];
        this.apiErrors.value = newErrors;
    },

    setGlobal(message) {
        this.global.value = message;
    }
};