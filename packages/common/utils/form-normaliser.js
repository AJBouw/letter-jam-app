export function normalizeSpaces(value) {
  return value.replace(/\s+/g, ' ');
}

export function trimStartSafe(value) {
  return value.replace(/^\s+/, '');
}