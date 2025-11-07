import { routes } from './micro-front-end-config.js';
import { render } from './micro-front-end-renderer.js';

const containerParent = document.getElementById('app') || document.body;

function getOrCreateContainer(containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        containerParent.appendChild(container);
    }
    return container;
}

function clearUnusedContainers(route) {
    const activeIds = route.pageLayout.map(l => l.containerId);
    Array.from(containerParent.children).forEach(child => {
        if (!activeIds.includes(child.id)) {
            if (child.currentApp?.unmount) child.currentApp.unmount();
            child.remove();
        }
    });
}

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
        await render(container, layout.importFile, { props: layout.props || {} });
    }
}

function router() {
    const path = window.location.pathname || '/';
    mountRoute(path);
}

window.addEventListener('popstate', router);
window.addEventListener('load', router);
window.navigate = (path) => { history.pushState({}, '', path); router(); };