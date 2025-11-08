import { details } from './details.js';

/**
 * Handles local/CDN
 * @param featureName
 * @param fileName
 * @returns {string}
 */
import details from '../micro-front-end-config.js';

export function getFeatureURL(featureName, fileName) {
    const isLocal = window.location.hostname === 'localhost';
    const basePath = isLocal
        ? `/src/features/${featureName}/dist/`
        : `https://cdn.jsdelivr.net/gh/${import.meta.env.VITE_GITHUB_USER}/letter-jam-app@${featureName}-v${details[featureName]?.version || '1.0.0'}/features/${featureName}/dist/`;

    return `${basePath}${fileName}`;
}