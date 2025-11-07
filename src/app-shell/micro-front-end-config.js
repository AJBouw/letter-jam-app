export const details = {
    'feature-home': { version: '1.0.0' },
    'feature-login': { version: '1.0.0' },
    'feature-quick-game': { version: '1.0.0' }
};

// baseRoutes: for global route mapping and lazy-load info
export const baseRoutes = [
    { path: '/', app: 'home', version: '1.0.0', file: '/features/feature-home/dist/feature-home.js', containerId: 'home' },
    { path: '/login', app: 'login', version: '1.0.0', file: '/features/feature-login/dist/feature-ogin.js', containerId: 'login' },
    { path: '/quick-game', app: 'quick-game', version: '1.0.0', file: '/features/feature-quick-game/dist/feature-quick-game-model.js', containerId: 'quick-game' }
];

// routes: detailed route definitions
export const routes = [
    {
        pathPattern: '/',
        pageTitle: 'Letter Jam',
        pageLayout: [
            {
                containerId: 'home-container',
                importFile: '../features/feature-home/dist/feature-home.js'
            }
        ]
    },
    {
        pathPattern: '/login',
        pageTitle: 'Login Page',
        pageLayout: [
            {
                containerId: 'login-container',
                importFile: '../features/feature-login/dist/feature-login.js'
            }
        ]
    },
    {
        pathPattern: '/quick-game',
        pageTitle: 'Quick Game',
        pageLayout: [
            {
                containerId: 'quick-game-container',
                importFile: '../features/feature-quick-game/dist/feature-quick-game-model.js'
            }
        ]
    }
];