import { signal } from '@preact/signals';

export const currentRoute = signal(window.location.pathname);

export function navigateTo(path) {
    if (path === currentRoute.value) return;
    window.history.pushState({}, '', path);
    currentRoute.value = path;
}

// Sync with browser back/forward
window.addEventListener('popstate', () => {
    currentRoute.value = window.location.pathname;
});