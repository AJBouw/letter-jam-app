import { computed } from '@preact/signals'

export function validateName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, reason: 'Name is required.' };
    }

    if (name.trim().length < 2) {
        return { valid: false, reason: 'Name must be at least 2 characters.' };
    }

    return { valid: true, reason: null };
}

export function nameValidatorSignal(nameSignal) {
    return computed(() => validateName(nameSignal.value));
}