export const PROTECTED_GAME_ROUTES = [
  /^\/games\/private(\/.*)?$/,
  /^\/games\/challenge(\/.*)?$/,
  /^\/games\/invite(\/.*)?$/,
];

export function isProtectedRoute(path) {
  return PROTECTED_GAME_ROUTES.some(pattern => pattern.test(path));
}