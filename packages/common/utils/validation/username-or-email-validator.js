export function validateUsernameOrEmail(value, { phase = 'submit' } = {}) {
  const input = value?.trim() ?? '';
  
  if (!input) {
    return { valid: phase === 'typing', reason: phase === 'typing' ? null : 'REQUIRED' };
  }
  
  const emailRegex = /^[\w._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const usernameRegex = /^[a-zA-Z0-9._-]{2,32}$/;
  
  if (!emailRegex.test(input) && !usernameRegex.test(input)) {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }
  
  return { valid: true, reason: null };
}