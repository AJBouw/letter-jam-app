import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { effect } from '@preact/signals';
import { ConnectivityStatusView, SignalController, userSession } from '@letter-limbo/common';
import { TopBarViewModel } from './top-bar-view-model.js';
import { Dropdown } from 'bootstrap';
import { UiTextEn } from '../../i18n/ui-text-en.js';

export class TopBarView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = undefined;
    
    // === UI state ===
    // Local reactive copy
    this.sessionUuidDisplay = '';
    
    // === Effects ===
    this._sessionEffect = effect(() => {
      if (userSession.sessionUuid.value) {
        this.sessionUuidDisplay = userSession.sessionUuid.value;
      }
    });
  }
  
  static properties = {
    gameContext: { type: Object },
    wsService: { type: Object },
    connectivityService: { type: Object },
    themeService: { type: Object },
    authService: { type: Object }
  };
  
  static scopedElements = { 'connectivity-status-view': ConnectivityStatusView }
  
  connectedCallback() {
    super.connectedCallback();
    if (!this.gameContext || !this.wsService || !this.connectivityService) {
      console.error('[top-bar-view] Missing required dependencies!');
      return;
    }
    
    if (!this.vm) {
      this.vm = new TopBarViewModel(
        this.gameContext,
        this.wsService,
        this.connectivityService,
        this.themeService,
        this.authService
      );
    }
    
    console.debug('[top-bar-view] ViewModel created with authService:', this.vm.authService);
    
    // Initialise Bootstrap dropdowns
    setTimeout(() => {
      const dropdownElements = this.querySelectorAll('.dropdown-toggle');
      dropdownElements.forEach(el => new Dropdown(el));
    }, 0);
    
    this.signals = new SignalController(this, [
      this.vm.backendOk,
      this.vm.wsServerOk,
      this.vm.themeService.logo,
      userSession.isAuthenticated
    ]);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    
    this._sessionEffect?.();
  }
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() { return this; }
  
  render() {
    const isDark = this.themeService?.isDark;
    const loggedIn = userSession.isAuthenticated.value;
    
    return html`
      <div class="d-flex justify-content-between align-items-center">
        <!-- Left: Logo -->
        <div class="d-flex align-items-center gap-2">
          <img
            src=${this.themeService.logo.value}
            alt="Letter Limbo logo"
            class="logo-img d-block"
          />
        </div>

        <!-- Center: Connectivity Status -->
        <div>
          <connectivity-status-view
            .backendOk=${this.vm.backendOk.value}
            .wsServerOk=${this.vm.wsServerOk.value}
          ></connectivity-status-view>
        </div>

        <!-- Right: Actions -->
        <div class="d-flex align-items-center gap-2">
          <!-- Toggle Theme -->
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-theme-toggle btn-sm ${isDark ? 'dark' : 'light'}"
              title=${UiTextEn.toggleTheme.title}
              @click=${() => this.vm.handleToggleTheme()}
            >
              ${isDark
                ? html`<span>🌙 Dark Mode</span>`
                : html`<span>🌞 Light Mode</span>`}
            </button>
          </div>
          
          <!-- About Dropdown -->
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary btn-sm dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              About
            </button>
            <ul class="dropdown-menu dropdown-menu-end p-2">
              <li class="meta-info"><strong>${UiTextEn.sessionUuidLabel}:</strong> ${this.sessionUuidDisplay}</li>
              <li class="meta-info"><strong>${UiTextEn.appVersionLabel}:</strong> 1.0.0</li>
            </ul>
          </div>

            <!-- Logout -->
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-login-logout btn-sm"
              @click=${() => {
                  if (loggedIn) {
                      this.vm.handleAuthToggle();
                  } else {
                      // **open overlay instead of calling login immediately**
                      this.dispatchEvent(new CustomEvent('open-login', { bubbles: true, composed: true }));
                  }
              }}
            >
              ${loggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('top-bar-view', TopBarView);