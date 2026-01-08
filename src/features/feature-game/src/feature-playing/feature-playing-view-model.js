import { computed, effect, signal } from '@preact/signals';
import { FeatureGameWsService } from '../FeatureGameWsService.js';

export class FeaturePlayingViewModel {
  constructor(sharedGameSession, wsService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.wsService = new FeatureGameWsService(this.wsService);
    
    // Core
    this.gameUuid = computed(() => this.sharedGameSession.gameUuid.value);
    this.gameStatus = computed(() => this.sharedGameSession.gameStatus.value);
    this.language = computed(() => this.sharedGameSession.language.value);
    this.maxPlayers = computed(() => this.sharedGameSession.maxPlayers.value);
    this.private = computed(() => this.sharedGameSession.private.value);
    
    // Players
    this.players = computed(() => this.sharedGameSession.players?.value ?? []);
    
    // Viewer-based
    this.playerUuid = computed(() => this.sharedGameSession.playerUuid.value);
    this.playerName = computed(() => this.sharedGameSession.playerName.value);
    
    // Reactive me / opponent
    this.me = computed(() => this.sharedGameSession.me?.value ?? null);
    this.opponent = computed(() => this.sharedGameSession.opponent?.value ?? null);
    
    // Safe reactive derived values
    this.activePlayerUuid = computed(() => this.sharedGameSession.activePlayerUuid?.value ?? null);
    // this.activePlayerName = computed(() => this.sharedGameSession.activePlayerName.value);
    this.activePlayerName = computed(() =>
      this.players.value.find(p => p.uuid === this.activePlayerUuid.value)?.name ?? '…'
    );
    this.isActivePlayer = computed(() =>
      this.activePlayerUuid.value && this.playerUuid.value
        ? this.activePlayerUuid.value === this.playerUuid.value
        : false
    );
    
    // Round info
    this.roundNumber = computed(() => this.sharedGameSession.roundNumber?.value ?? 0);
    this.roundStatus = computed(() => this.sharedGameSession.roundStatus?.value ?? null);
    this.blocks = computed(() => this.sharedGameSession.blocks?.value ?? []);
    this.guesses = computed(() => this.sharedGameSession.guesses?.value ?? []);
    this.maskedWord = computed(() => this.sharedGameSession.maskedWord?.value ?? '');
    
    // Local input state
    this.guessInput = signal('');
    this.submittingGuess = signal(false);
    
    // Game state signals
    this.leavingGame = signal(false);
    
    effect(() => {
      console.debug('[FeaturePlayingViewModel] blocks', this.blocks.value);
    });
  }
  
  updateGuess(value) {
    this.guessInput.value = value.toUpperCase();
  }
  
  submitGuess() {
    if (!this.isActivePlayer.value) return;
    this.submittingGuess.value = true;
    
    this.wsService.submitGuess({
      gameUuid: this.sharedGameSession.gameUuid.value,
      roundUuid: this.sharedGameSession.roundUuid.value,
      playerUuid: this.sharedGameSession.playerUuid.value,
      guess: this.guessInput.value
    });
    this.guessInput.value = '';
  }
  
  // Leave game
  async leaveGame() {
    if (this.leavingGame.value) return;
    this.leavingGame.value = true;
    
    try {
      await this.wsService.cancelGame(this.gameUuid.value, this.playerUuid.value);
    } catch (err) {
      console.error('[playing] Failed to leave game', err);
    } finally {
      this.leavingGame.value = false;
    }
  }
}