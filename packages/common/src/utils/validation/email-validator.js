import { computed } from '@preact/signals';

export function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return { valid: false, reason: 'Email is required.' };
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
        valid: regex.test(email),
        reason: regex.test(email) ? null : 'Please enter a valid email address.',
    };
}

export function emailValidatorSignal(emailSignal) {
    return computed(() => validateEmail(emailSignal.value));
}