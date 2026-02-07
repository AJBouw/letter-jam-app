export function passwordValidator(
  value,
  { mode = 'login', phase = 'submit' } = {}
) {
  const input = value ?? '';
  
  if (!input) {
    return phase === 'typing'
      ? { valid: true, reason: null }
      : { valid: false, reason: 'REQUIRED' };
  }
  
  if (mode === 'register') {
    if (input.length < 8) {
      return { valid: false, reason: 'TOO_SHORT' };
    }
    
    const strongRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    
    if (!strongRegex.test(input)) {
      return { valid: false, reason: 'TOO_WEAK' };
    }
  }
  
  return { valid: true, reason: null };
}