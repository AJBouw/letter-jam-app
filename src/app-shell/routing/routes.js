import { html } from 'lit';
import '../../features/feature-home/src/feature-home-view.js';
import '../../features/feature-login/src/feature-login-view.js';
import '../../features/feature-quick-game/src/feature-quick-game-view.js';
import '../../features/feature-game/src/waiting-for-players/waiting-for-players-view.js';
import '../../features/feature-game/src/ready-to-start/ready-to-start-view.js';
import '../../features/feature-game/src/playing/playing-view.js';

export const AppRoutes = [
    { path: '/', render: () => html`<feature-home-view></feature-home-view>` },
    { path: '/login', render: () => html`<feature-login-view></feature-login-view>` },
    { path: '/quick-game', render: () => html`<feature-quick-game-view></feature-quick-game-view>` },

    { path: '/quick-game/waiting-for-players',
        render: () => html`<waiting-for-players-view></waiting-for-players-view>` },

    { path: '/quick-game/in-progress',
        render: () => html`<in-progress-view></in-progress-view>` },

    { path: '/quick-game/playing',
        render: () => html`<playing-view></playing-view>` },
];