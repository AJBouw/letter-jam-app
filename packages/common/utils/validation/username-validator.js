export function usernameValidator(value, { phase = 'submit' } = {}) {
  const input = value?.trim() ?? '';
  
  if (!input) {
    return phase === 'typing'
      ? { valid: true, reason: null }
      : { valid: false, reason: 'REQUIRED' };
  }
  
  if (input.length < 2) {
    return { valid: false, reason: 'TOO_SHORT' };
  }
  
  if (input.length > 32) {
    return { valid: false, reason: 'TOO_LONG' };
  }
  
  // Must start with a letter
  if (!/^[a-zA-Z]/.test(input)) {
    return { valid: false, reason: 'MUST_START_WITH_LETTER' };
  }
  
  // Allowed characters only
  if (!/^[a-zA-Z0-9._-]+$/.test(input)) {
    return { valid: false, reason: 'INVALID_CHARACTERS' };
  }
  
  // No consecutive special characters
  if (/[._-]{2,}/.test(input)) {
    return { valid: false, reason: 'CONSECUTIVE_SPECIALS' };
  }
  
  // No trailing special character
  if (/[._-]$/.test(input)) {
    return { valid: false, reason: 'TRAILING_SPECIAL' };
  }
  
  return { valid: true, reason: null };
}