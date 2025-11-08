import { details } from './micro-front-end-config.js';

/**
 * Dynamically builds the correct URL for a micro frontend (feature)
 * depending on environment: local (localhost) or CDN (GitHub release).
 */
export function getFeatureURL(featureName, fileName) {
    const isLocal = window.location.hostname === 'localhost';

    if (isLocal) {
        // 🔹 Local development path (served by Vite dev servers)
        return `/src/features/${featureName}/src/${fileName}`;
    } else {
        // 🔹 Production CDN path
        const version = details[featureName]?.version || '1.0.0';
        // The username is provided via environment variable during build
        const githubUser = import.meta.env.VITE_GITHUB_USER;

        if (!githubUser) {
            console.error(
                '❌ Missing VITE_GITHUB_USER environment variable! Ensure it is set in GitHub Actions or .env file.'
            );
        }

        return `https://cdn.jsdelivr.net/gh/${githubUser}/letter-jam-app@${featureName}-v${version}/src/features/${featureName}/dist/${fileName}`;
    }
}

/**
 * Dynamically loads and mounts a micro frontend (feature) into a given container.
 *
 * This function:
 *   1. Resolves the feature bundle URL via `getFeatureURL` (local dev or CDN)
 *   2. Dynamically imports the feature’s JavaScript module
 *   3. Clears the container’s previous content and calls the feature’s exported `mount(container, props)` function
 *   4. Passes optional `props` to the feature during mounting
 *
 * Requirements for a feature bundle:
 *   - Must export a `mount(container, props)` function
 *   - Should handle its own internal state and subcomponents
 *
 * @param {HTMLElement} container - The DOM element where the feature will be mounted
 * @param {string} featureURL - The URL of the feature JS bundle (from getFeatureURL)
 * @param {object} [options] - Optional options to pass to the feature, e.g., { props: {...} }
 */
export async function render(container, fileURL, options = {}) {
    const featureName = options.featureName || 'unknown';
    const featureURL = fileURL || getFeatureURL(featureName, `${featureName}.js`);

    if (!container) {
        console.error(`❌ Container not found for ${featureName}`);
        return;
    }

    try {
        const module = await import(/* @vite-ignore */ featureURL);
        if (module && typeof module.mount === 'function') {
            container.innerHTML = '';
            module.mount(container, options.props || {});
            console.log(`✅ Loaded ${featureName} from ${featureURL}`);
        } else {
            console.error(`❌ ${featureName} does not export mount(container)`);
        }
    } catch (err) {
        console.error(`❌ Failed to load ${featureName}:`, err);
    }
}