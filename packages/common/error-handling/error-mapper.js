export const errorMap = {
  NETWORK_ERROR: { code: 'NETWORK_ERROR', status: null, message: 'Unable to connect to the server. Please check your network.' },
  UNEXPECTED_ERROR: { code: 'UNEXPECTED_ERROR', status: null, message: 'An unexpected error occurred. Please try again.' },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400, message: 'Please check your input for errors.' },
  GAME_ALREADY_STARTED: { code: 'GAME_ALREADY_STARTED', status: 409, message: 'A game is already in progress, please try again later.' },
  GAME_FULL: { code: 'GAME_FULL', status: 409, message: 'The game is full, please try again later.' },
  DB_SCHEMA_MISSING: { code: 'DB_SCHEMA_MISSING', status: 503, message: 'System is initializing, please try again shortly.' },
  EMAIL_ALREADY_USED: { code: 'EMAIL_ALREADY_USED', status: 400, message: 'This email is already registered.' },
  INVALID_EMAIL: { code: 'INVALID_EMAIL', status: 400, message: 'Please enter a valid email address.' },
  NICKNAME_INVALID: { code: 'NICKNAME_INVALID', status: 400, message: 'Nickname must be at least 2 characters.' },
  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', status: 404, message: 'User not found.' },
  INVALID_PASSWORD: { code: 'INVALID_PASSWORD', status: 401, message: 'Incorrect password.' },
  SESSION_EXPIRED: { code: 'SESSION_EXPIRED', status: 401, message: 'Your session expired, please log in again.' },
  DB_UNAVAILABLE: { code: 'DB_UNAVAILABLE', status: 503, message: 'Service temporarily unavailable, please try again.' },
  INTERNAL_SERVER_ERROR: { code: 'INTERNAL_SERVER_ERROR', status: 500, message: 'Unexpected error occurred, please try again.' },
  CONSTRAINT_VIOLATION: { code: 'CONSTRAINT_VIOLATION', status: 400, message: 'Submission failed due to invalid or missing data.' }
};