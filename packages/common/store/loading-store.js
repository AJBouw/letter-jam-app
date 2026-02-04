import { signal } from '@preact/signals';

/**
 * Global loading indicator
 */
export const loadingStore = {
    global: signal(false),
    apiCalls: signal({}),

    set(key, value) {
        this.apiCalls.value = { ...this.apiCalls.value, [key]: value };
    },

    setGlobal(value) {
        this.global.value = value;
    }
};