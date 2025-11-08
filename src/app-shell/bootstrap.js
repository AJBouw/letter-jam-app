import { routes } from './micro-front-end-config.js';
import { render } from './micro-front-end-renderer.js';

// Parent container for all micro-frontends
const containerParent = document.getElementById('app') || document.body;

// Create or get container element by ID
function getOrCreateContainer(containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        containerParent.appendChild(container);
    }
    return container;
}

// Remove containers not used by the current route
function clearUnusedContainers(route) {
    const activeIds = route.pageLayout.map(l => l.containerId);
    Array.from(containerParent.children).forEach(child => {
        if (!activeIds.includes(child.id)) {
            if (child.currentApp?.unmount) {
                try { child.currentApp.unmount(); } catch(e) { console.warn(e); }
            }
            child.remove();
        }
    });
}

// Mount all micro-frontends for the current route
async function mountRoute(path) {
    const route = routes.find(r => r.pathPattern === path);
    if (!route) {
        containerParent.innerHTML = '<h1>404 - Page Not Found</h1>';
        return;
    }

    document.title = route.pageTitle || 'Letter Jam';
    clearUnusedContainers(route);

    for (const layout of route.pageLayout) {
        const container = getOrCreateContainer(layout.containerId);

        // Pass lazyLoad: true if desired
        await render(container, layout.importFile, {
            props: layout.props || {},
            lazyLoad: false // set true if you want lazy loading
        });
    }
}

function router() {
    const path = window.location.pathname || '/';
    mountRoute(path);
}

window.addEventListener('popstate', router);
window.addEventListener('load', router);

// Expose navigate function for programmatic routing
window.navigate = (path) => {
    history.pushState({}, '', path);
    router();
};