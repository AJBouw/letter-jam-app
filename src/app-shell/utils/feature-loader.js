import { details } from './details.js';

/**
 * Handles local/CDN
 * @param featureName
 * @param fileName
 * @returns {string}
 */
export function getFeatureURL(featureName, fileName) {
    const isLocal =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

    const gitHubUser = import.meta.env.VITE_GITHUB_USER;

    if (isLocal) {
        // 🔹 Local development — use built files directly
        return `../src/features/${featureName}/dist/${fileName}`;
    }

    // 🔹 Production — load from GitHub CDN (jsDelivr)
    const version =
        (window.details && window.details[featureName]?.version) ||
        'v1.0.0'; // fallback

    // example:
    // https://cdn.jsdelivr.net/gh/AJBouw/letter-jam-app@feature-home-v202511072115/src/features/feature-home/dist/feature-home.js
    return `https://cdn.jsdelivr.net/gh/${gitHubUser}/letter-jam-app@${featureName}-${version}/src/features/${featureName}/dist/${fileName}`;
}