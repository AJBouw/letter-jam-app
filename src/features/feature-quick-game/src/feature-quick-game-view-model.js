import { signal, computed, effect } from '@preact/signals'
import { connectivity, emailValidatorSignal, GameStatus, nameValidatorSignal, webSocketService } from '@letter-limbo/common';
import { FeatureQuickGameService } from './FeatureQuickGameService.js';

export class FeatureQuickGameViewModel {
  constructor(session) {
    this.session = session;
    this.connectivity = connectivity;
    this.service = new FeatureQuickGameService();
    
    this.screen = computed(() => {
      console.log('session.gameStatus.value', session.gameStatus.value);
      switch (session.gameStatus.value) {
        case GameStatus.WAITING_FOR_PLAYERS: return 'WAITING';
        case GameStatus.READY_TO_START: return 'READY';
        case GameStatus.PLAYING: return 'PLAYING';
        default: return 'FORM';
      }
    });
    
    // Form state
    this.name = signal('');
    this.email = signal('');
    this.language = signal('nl');
    
    this.nameTouched = signal(false);
    this.emailTouched = signal(false);
    
    // validation
    this.nameValidation = nameValidatorSignal(this.name);
    this.emailValidation = emailValidatorSignal(this.email);
    
    // UI state
    this.loading = signal(true);
    
    this.canSubmit = computed(() =>
      this.nameTouched.value &&
      this.emailTouched.value &&
      this.nameValidation.value.valid &&
      this.emailValidation.value.valid &&
      this.connectivity.canSubmit.value &&
      !this.loading.value
    );
    
    // Auto-reset loading once backend + WS are up
    effect(() => {
      if (this.connectivity.backendOk.value && this.connectivity.wsOk.value) {
        this.loading.value = false;
      }
    });
  }
  
  start() {
    this.loading.value = true;
    this.connectivity.start('quick-game-lobby');
  }
  
  stop() {
    this.connectivity.stop();
  }
  
  markNameTouched() { this.nameTouched.value = true; }
  markEmailTouched() { this.emailTouched.value = true; }
  
  async startQuickGame() {
    if (!this.canSubmit.value) return;
    
    this.loading.value = true;
    
    try {
      const response = await this.service.requestQuickGame({
        name: this.name.value,
        email: this.email.value,
        language: this.language.value
      });
      
      const gameData = response.data;
      console.log('[VM] response', response);
      console.log('[VM] response', gameData);
      
      this.session.gameUuid.value = gameData.uuid;
      console.log('[VM] gameuuid ', gameData.uuid);
      
      this.session.applyBackendSnapshot(gameData);
      
      const me = gameData.currentPlayer ?? gameData.playersList[0];
      this.session.currentPlayer.value = me;
      this.session.playerUuid.value = me.uuid;
      this.session.playerName.value = me.name;
      
      webSocketService.connect(gameData.uuid,msg => this.session.handleMessage(msg), me.uuid, me.name);
      
      this.loading.value = false;
      console.log('[vm] screen value ', this.screen.value);
      // this.screen.value = 'WAITING';
      // Reset form
      this.name.value = '';
      this.email.value = '';
      this.language.value = 'nl';
      this.nameTouched.value = false;
      this.emailTouched.value = false;
    } finally {
      this.loading.value = false;
    }
  }
}