import { computed, effect, signal } from '@preact/signals';
import { FeatureGameWsService } from '../FeatureGameWsService.js';

export class FeaturePlayingViewModel {
  constructor(sharedGameSession, wsService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    
    // WS Service (safe subscription only after WS ready)
    this.featureGameWsService = new FeatureGameWsService(
      this.sharedGameSession,
      this.wsService
    );
    
    // ============================================= //
    // Derived game state (delegated to GameSession) //
    // ============================================= //
    this.players = computed(() => this.sharedGameSession?.players?.value ?? []);
    this.playerUuid = computed(() => this.sharedGameSession?.playerUuid?.value ?? null);
    this.me = computed(() => this.sharedGameSession?.me?.value ?? null);
    this.opponent = computed(() => this.sharedGameSession?.opponent?.value ?? null);
    this.activePlayerUuid = computed(() => this.sharedGameSession?.activePlayerUuid?.value ?? null);
    this.activePlayerName = computed(() =>
      this.players.value.find(p => p.uuid === this.activePlayerUuid.value)?.name ?? '…'
    );
    this.isActivePlayer = computed(() =>
      this.activePlayerUuid.value && this.playerUuid.value
        ? this.activePlayerUuid.value === this.playerUuid.value
        : false
    );
    this.roundNumber = computed(() => this.sharedGameSession?.roundNumber?.value ?? 0);
    this.roundStatus = computed(() => this.sharedGameSession?.roundStatus?.value ?? null);
    this.winningPlayerUuid = computed(() => this.sharedGameSession.roundDetails.value?.winningPlayerUuid ?? null);
    this.isRoundFinished = computed(() => this.roundStatus.value === 'FINISHED');
    
    this.boardRows = computed(() => this.sharedGameSession?.boardRows?.value ?? []);
    
    this.canSubmitGuess = computed(() =>
      this.isActivePlayer.value && this.roundStatus.value === 'IN_PROGRESS'
    );
    
    // ============== //
    // UI-local state //
    // ============== //
    this.guessInput = signal('');
    this.submittingGuess = signal(false);
    this.submitMessage = signal('');
    this.leavingGame = signal(false);
    
    // Connect WS safely if all identifiers exist
    effect(() => {
      if (
        this.sharedGameSession.gameUuid.value &&
        this.sharedGameSession.playerUuid.value &&
        this.sharedGameSession.playerName.value
      ) {
        if (this.wsService?.stompClient?.connected) {
          this.featureGameWsService.connect(
            this.sharedGameSession.gameUuid.value,
            this.sharedGameSession.playerUuid.value,
            this.sharedGameSession.playerName.value
          );
        }
      }
    });
  }
  
  updateGuess(value) {
    this.guessInput.value = (value ?? '').toUpperCase();
  }
  
  submitGuess() {
    if (!this.sharedGameSession.canSubmitGuess.value) {
      this.submitMessage.value = 'Not your turn!';
      return;
    }
    
    const payload = {
      gameUuid: this.sharedGameSession.gameUuid.value,
      roundUuid: this.sharedGameSession.roundUuid.value,
      playerUuid: this.sharedGameSession.playerUuid.value,
      guess: this.guessInput.value ?? ''
    };
    
    if (!payload.gameUuid || !payload.roundUuid || !payload.playerUuid) return;
    
    try {
      this.featureGameWsService.submitGuess(payload);
      this.guessInput.value = '';
      this.submittingGuess.value = true;
      this.submitMessage.value = 'Checking guess…';
      setTimeout(() => {
        if (this.submittingGuess.value) {
          this.submittingGuess.value = false;
          this.submitMessage.value = 'Submission failed, try again!';
        }
      }, 5000);
    } catch (err) {
      console.error('[FeaturePlayingViewModel] Submit guess failed', err);
      this.submittingGuess.value = false;
      this.submitMessage.value = 'Could not send guess, check connection.';
    }
  }
}