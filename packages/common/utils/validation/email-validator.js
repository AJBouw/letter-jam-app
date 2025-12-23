import { computed } from '@preact/signals';

export function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { valid: false, reason: 'Email is required.' };
  }
  
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return {
      valid: regex.test(email),
      reason: regex.test(email) ? null : 'Please enter a valid email address.',
  };
}

export function emailValidatorSignal(emailSignal) {
  return computed(() => validateEmail(emailSignal.value));
}