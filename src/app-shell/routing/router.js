import { html } from 'lit';
import { AppRoutes } from './routes.js';

export function resolveRoute(path) {
    const route = AppRoutes.find(r => r.path === path);
    return route ? route.render() : html`<p>404: Not Found</p>`;
}