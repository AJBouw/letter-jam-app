import { errorMap } from './error-mapper.js';

export function createAppError({ code = 'UNEXPECTED_ERROR', status = null, message = null, cause = null }) {
  const mapped = errorMap[code] ?? errorMap.UNEXPECTED_ERROR;
  
  return {
    name: 'AppError',
    code: mapped.code,
    status: status ?? mapped.status,
    message: message ?? mapped.message,
    cause
  };
}