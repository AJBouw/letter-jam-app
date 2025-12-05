import { computed } from '@preact/signals';

export function passwordValidatorSignal(passwordSignal) {
  return computed(() => {
    const value = passwordSignal.value;
    if (!value) return { valid: false, reason: 'Password is required' };
    return { valid: true, reason: null };
  });
}