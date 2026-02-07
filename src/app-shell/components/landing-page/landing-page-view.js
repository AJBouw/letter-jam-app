import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { effect } from '@preact/signals';
import { connectivityService, gameContext, SignalController, userSession } from '@letter-limbo/common';
import { LandingPageViewModel } from './landing-page-view-model.js';
import { UiTextEn } from '../../i18n/ui-text-en.js';
import { ErrorTextEn } from '../../i18n/error-text.en.js';

export class LandingPageView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = new LandingPageViewModel(connectivityService, gameContext);
    this._signals = null;
    this._sessionEffect = null;
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Wire signals to DOM
    this._signals = new SignalController(this, [
      this.vm.welcomeMessage,
      this.vm.loading,
      this.vm.canSubmit,
      this.vm.connectivityService.backendOk,
      this.vm.connectivityService.wsServerOk,
      this.vm.featuredGames,
      this.vm.errorMessage
    ]);
    
    this._sessionEffect = effect(() => {
      if (userSession.sessionUuid.value) {
        this.vm.welcomeMessage.value = `Welcome, session ${userSession.sessionUuid.value}!`;
      }
    });
    
    this.vm.start();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    
    this._signals?.disconnect();
    this._sessionEffect?.();
    this.vm?.stop();
  }
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() { return this; }
  
  render() {
    return html`
      <div class="container py-4">
        <!-- Title -->
        <h1 class="section-title mb-3">${UiTextEn.pages.landingPage.title}</h1>
        <!-- Short Description -->
        <p class="lead text-secondary mb-4">
          ${UiTextEn.pages.landingPage.shortDescription}
        </p>

        <!-- Feature Highlights -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title custom-card-title">${UiTextEn.pages.landingPage.highlights.quickStart.title}</h5>
                <p class="card-text">${UiTextEn.pages.landingPage.highlights.quickStart.description}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title custom-card-title">${UiTextEn.pages.landingPage.highlights.themeMode.title}</h5>
                <p class="card-text">${UiTextEn.pages.landingPage.highlights.themeMode.description}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card shadow-sm h-100">
              <div class="card-body">
                <h5 class="card-title custom-card-title">${UiTextEn.pages.landingPage.highlights.gameMultiLingual.title}</h5>
                <p class="card-text">${UiTextEn.pages.landingPage.highlights.gameMultiLingual.description}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Games Grid -->
        <div class="mb-4">
          <h4 class="custom-card-title mb-3">${UiTextEn.pages.landingPage.featuredGames}</h4>
          ${this.vm.loading.value
            ? html`
              <div class="text-center py-5">
                <div class="spinner-border spinner-green" role="status">
                  <span class="visually-hidden">${ErrorTextEn.loading}</span>
                </div>
              </div>`
            : html`
              ${this.vm.errorMessage.value
                ? html`<div class="alert alert-danger">${this.vm.errorMessage.value}</div>`
                : html`
                  <div class="row g-3">
                    ${this.vm.featuredGames.value.map(game => html`
                      <div class="col-12 col-md-4">
                        <button
                          class="btn btn-primary w-100 ${!this.vm.canSubmit.value ? 'disabled' : ''}"
                          @click=${() => this.vm.startGame(game.id)}
                        >
                          ${game.name}
                        </button>
                      </div>
                    `)}
                  </div>
                `}
            `}
        </div>

        <!-- Upcoming Features -->
        <div class="mb-4">
          <h4 class="section-title">${UiTextEn.pages.landingPage.upcomingFeatures.title}</h4>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${UiTextEn.pages.landingPage.upcomingFeatures.items.account}</li>
            <li class="list-group-item">${UiTextEn.pages.landingPage.upcomingFeatures.items.multiPlayer}</li>
            <li class="list-group-item">${UiTextEn.pages.landingPage.upcomingFeatures.items.rankingSystem}</li>
          </ul>
        </div>

        <!-- Latest Release / Updates -->
        <div class="alert alert-success mb-4" role="alert">
            ${UiTextEn.pages.landingPage.latestRelease.description}
        </div>
      </div>
    `;
  }
}

customElements.define('landing-page-view', LandingPageView);