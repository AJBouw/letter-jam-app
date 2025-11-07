export async function render(container, importFile, options = {}) {
    try {
        // Display loading
        container.innerHTML = options.loadingTemplate || '<p class="spinner">Loading...</p>';

        // If lazy loading is enabled, defer loading until container is visible
        if (options.lazyLoad && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(async (entries) => {
                if (entries[0].isIntersecting) {
                    observer.disconnect();
                    await actuallyRender(container, importFile, options);
                }
            });
            observer.observe(container);
        } else {
            // Immediate render
            await actuallyRender(container, importFile, options);
        }

    } catch (err) {
        console.error('Failed to render micro-frontend:', err);
        container.innerHTML = options.errorTemplate || '<p class="error">Error loading app</p>';
    }
}

// Helper function to actually import + mount the micro-frontend
async function actuallyRender(container, importFile, options) {
    try {
        const module = await import(importFile);

        // Cleanup previous micro-frontend if it exists
        if (container.currentApp) {
            try {
                container.currentApp.unmount?.();
            } catch (e) {
                console.warn(`Unmount failed for ${importFile}`, e);
            }
            container.innerHTML = ''; // clear DOM
        }

        // Mount the new micro-frontend
        module.mount(container, options.props || {});
        container.currentApp = module;

    } catch (err) {
        console.error('Error loading module:', err);
        container.innerHTML = options.errorTemplate || '<p class="error">Error loading app</p>';
    }
}