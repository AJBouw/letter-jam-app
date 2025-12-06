export function toUrlSegment(gameStatus) {
  return gameStatus.toLowerCase().replace(/_/g, '-');
}

export function fromUrlSegment(segment) {
  return segment.toUpperCase().replace(/-/g, '_');
}