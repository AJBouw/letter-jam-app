import { LitElement, html } from 'lit';
import { currentRoute } from './current-route.js';
import { resolveRoute } from './router.js';

/**
 * Eliminates the need for .key=${path} hacks in AppShell
 */
export class RouterOutlet extends LitElement {
    static properties = {
        route: { type: String }
    };

    constructor() {
        super();
        this.route = currentRoute.value;

        // Reactive: update route whenever currentRoute changes
        currentRoute.subscribe((path) => {
            this.route = path;
            this.requestUpdate();
        });
    }

    render() {
        // Render the correct route
        return html`${resolveRoute(this.route)}`;
    }
}

customElements.define('router-outlet', RouterOutlet);