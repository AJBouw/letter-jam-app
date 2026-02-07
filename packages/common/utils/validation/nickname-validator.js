export function nicknameValidator(value, { phase = 'submit' } = {}) {
  const input = value?.trim() ?? '';
  
  if (!input) {
    return phase === 'typing'
      ? { valid: true, reason: null }
      : { valid: false, reason: 'REQUIRED' };
  }
  
  if (input.length < 2) {
    return phase === 'typing'
      ? { valid: true, reason: null }
      : { valid: false, reason: 'TOO_SHORT' };
  }
  
  const allowed = /^[\p{L}\d.\-#_ ]+$/u;
  if (!allowed.test(input)) {
    return { valid: false, reason: 'INVALID_CHARACTERS' };
  }
  
  return { valid: true, reason: null };
}