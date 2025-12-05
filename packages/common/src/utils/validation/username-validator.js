import { computed } from '@preact/signals';

export function usernameValidatorSignal(usernameSignal) {
  return computed(() => {
    const value = usernameSignal.value.trim();
    if (!value) return { valid: false, reason: 'Username is required' };
    return { valid: true, reason: null };
  });
}