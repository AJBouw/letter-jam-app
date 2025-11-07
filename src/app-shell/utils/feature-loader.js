import { details } from './details.js';

/**
 * Handles local/CDN
 * @param featureName
 * @param fileName
 * @returns {string}
 */
export function getFeatureURL(featureName, fileName) {
    const isLocal = window.location.hostname === 'localhost';
    if (isLocal) {
        return `../features/${featureName}/dist/${fileName}`;
    } else {
        const version = details[featureName]?.version || '1.0.0';
        return `https://cdn.jsdelivr.net/gh/<username>/letter-jam-app@${featureName}-v${version}/features/${featureName}/dist/${fileName}`;
    }
}