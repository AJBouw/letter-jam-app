import { html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement } from 'lit';
import { FeaturePlayingViewModel } from './feature-playing-view-model.js';
import { FeaturePlayingViewStyles } from './feature-playing-view.styles.js';

export class FeaturePlayingView extends ScopedElementsMixin(LitElement) {
  static properties = {
    sharedGameSession: { type: Object },
    wsService: { type: Object },
    connectivityService: { type: Object}
  };
  
  static styles = [ FeaturePlayingViewStyles ];
  
  disconnectedCallback() {
    this.vm.dispose();
    super.disconnectedCallback();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  updated(changedProps) {
    if (!this.vm && this.sharedGameSession && this.wsService) {
      this.vm = new FeaturePlayingViewModel(
        this.sharedGameSession,
        this.wsService,
        this.connectivityService
      );
    }
  }
  
  render() {
    
    return html`
        <section class="game-playing">
            <!-- Header with player info -->
            <header class="players-header">
                test
        </section>
    `;
  }
}

customElements.define('feature-playing-view', FeaturePlayingView);