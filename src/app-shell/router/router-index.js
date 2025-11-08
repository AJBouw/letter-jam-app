import { Router } from '@vaadin/router';

export function initRouter() {
    const outlet = document.querySelector('app-shell').shadowRoot.getElementById('outlet');
    const router = new Router(outlet);

    router.setRoutes([
        { path: '/', component: 'game-view' },
        { path: '(.*)', redirect: '/' },
    ]);
}