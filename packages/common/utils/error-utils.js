import { errorMap } from './../error-handling/error-mapper.js';

export function resolveError(error) {
  // Network / fetch errors (no response)
  if (!error?.response) {
    return errorMap.NETWORK_ERROR;
  }
  
  // Backend error payload
  const code = error.response?.data?.code;
  
  return errorMap[code] ?? errorMap.UNEXPECTED_ERROR;
}