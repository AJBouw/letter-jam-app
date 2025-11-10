export class Renderer {
    constructor(container) {
        this.container = container;
        this.currentFeatures = [];
    }

    /**
     * Mount multiple features at once
     * @param {string[]} tags - custom element tags
     */
    async loadFeatures(tags = []) {
        // Remove features not needed anymore
        for (const old of this.currentFeatures) {
            const tag = old.tagName.toLowerCase();
            if (!tags.includes(tag)) {
                this.container.removeChild(old);
            }
        }

        // Mount new features
        for (const tag of tags) {
            if (!this.container.querySelector(tag)) {
                const el = document.createElement(tag);
                this.container.appendChild(el);
            }
        }

        // Track currently mounted features
        this.currentFeatures = Array.from(this.container.children);
    }
}