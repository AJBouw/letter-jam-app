import { getFeatureURL } from './utils/feature-loader.js';

export const baseRoutes = [
    {
        path: '/',
        app: 'home',
        version: '1.0.0',
        file: getFeatureURL('feature-home', 'feature-home.js'),
        containerId: 'home'
    },
    {
        path: '/login',
        app: 'login',
        version: '1.0.0',
        file: getFeatureURL('feature-login', 'feature-login.js'),
        containerId: 'login'
    },
    {
        path: '/quick-game',
        app: 'quick-game',
        version: '1.0.0',
        file: getFeatureURL('feature-quick-game', 'feature-quick-game.js'),
        containerId: 'quick-game'
    }
];

export const routes = [
    {
        pathPattern: '/',
        pageTitle: 'Letter Jam',
        pageLayout: [
            {
                containerId: 'home-container',
                importFile: getFeatureURL('feature-home', 'feature-home.js')
            }
        ]
    },
    {
        pathPattern: '/login',
        pageTitle: 'Login Page',
        pageLayout: [
            {
                containerId: 'login-container',
                importFile: getFeatureURL('feature-login', 'feature-login.js')
            }
        ]
    },
    {
        pathPattern: '/quick-game',
        pageTitle: 'Quick Game',
        pageLayout: [
            {
                containerId: 'quick-game-container',
                importFile: getFeatureURL('feature-quick-game', 'feature-quick-game.js')
            }
        ]
    }
];