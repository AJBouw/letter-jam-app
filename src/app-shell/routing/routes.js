import { html } from 'lit';
import '../../features/feature-home/feature-home.js';
import '../../features/feature-login/feature-login.js';
import '../../features/feature-quick-start/feature-quick-start.js';
import '../../features/feature-game/src/waiting-for-players/waiting-for-players-view.js';
import '../../features/feature-game/src/in-progress/in-progress-view.js';
import '../../features/feature-game/src/playing/playing-view.js';

export const AppRoutes = [
    { path: '/', render: () => html`<feature-home></feature-home>` },
    { path: '/login', render: () => html`<feature-login></feature-login>` },
    { path: '/quick-game', render: () => html`<feature-quick-start></feature-quick-start>` },

    { path: '/quick-game/waiting-for-players',
        render: () => html`<waiting-for-players-view></waiting-for-players-view>` },

    { path: '/quick-game/in-progress',
        render: () => html`<in-progress-view></in-progress-view>` },

    { path: '/quick-game/playing',
        render: () => html`<playing-view></playing-view>` },
];