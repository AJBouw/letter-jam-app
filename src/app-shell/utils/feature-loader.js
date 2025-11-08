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
        // The username is provided via environment variable during build
        const githubUser = import.meta.env.VITE_GITHUB_USER;

        if (!githubUser) {
            console.error(
                'Missing VITE_GITHUB_USER environment variable! Ensure it is set in GitHub Actions or .env file.'
            );
        }

        return `https://cdn.jsdelivr.net/gh/${githubUser}/letter-jam-app@build-dist/jsdelivr-dist/${featureName}/${fileName}`;
    }
}