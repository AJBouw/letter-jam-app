import { computed, effect } from '@preact/signals';
import { RoundStatus } from "../domain/round-status.js";

export class GameDerived {
  constructor(gameState) {
    this.gameState = gameState;
    
    // === Player related ===
    // Me (local player)
    this.me = computed(() =>
      gameState.players.value.find(p => p.uuid === gameState.playerUuid.value) ?? null
    );
    
    // Opponent (first player who is not me)
    this.opponent = computed(() => {
      const me = this.me.value;
      if (!me) return null;
      return gameState.players.value.find(p => p.uuid !== me.uuid) ?? null;
    });
    
    this.activePlayerUuid = computed(() => gameState.activePlayerUuid.value);
    this.activePlayerNickname = computed(() => {
      const startingPlayer = this.gameState.players.value.find(p => p.playerNumber === 1);
      if (!startingPlayer) return '…';
      return startingPlayer.nickname ?? '…';
    })
    
    // this.activePlayer = computed(() => gameState.players.value.find(
    //   p => p.uuid === this.activePlayerUuid.value
    //   ) ?? null
    // );
    this.isActivePlayer = computed(() => {
      const optimistic = this.optimisticActivePlayerUuid.value;
      const backendActive = this.activePlayerUuid.value;
      
      // If the round is still in progress, treat local player as active optimistically
      if (this.roundStatus.value === RoundStatus.IN_PROGRESS) {
        return (optimistic ?? backendActive) === this.playerUuid.value;
      }
      
      // Otherwise, follow backend state
      return backendActive === this.playerUuid.value;
    });
    
    effect(() => {
      console.debug('[game-derived]', {
        playerUuid: this.gameState.playerUuid.value,
        activePlayerUuid: this.activePlayerUuid.value,
        players: this.gameState.players.value.map(p => ({
          uuid: p.uuid,
          nickname: p.nickname
        })),
        me: this.me.value,
        opponent: this.opponent.value
      });
    });
    
    // === Game related ===
    this.roundNumber = computed(() => gameState.roundDetails.value?.roundNumber ?? null);
    
    this.isGameFinished = computed(() =>
      gameState.gameStatus.value === 'FINISHED'
    );
    
    this.winningPlayer = computed(() =>
      this.gameState.players.value.find(
        p => p.uuid === this.gameState.winningGamePlayerUuid.value
      ) ?? null
    );
    
    // Board
    this.boardRows = computed(() => this._rebuildBoard());
  }
  
  // === helper methods ===
  
  _rebuildBoard() {
    const round = this.gameState.roundDetails.value;
    if (!round) return [];
    
    const guesses = round.guesses ?? [];
    const maskedWord = round.maskedWord ?? '';
    const wordLength = maskedWord.length;
    const maxRows = 5;
    
    return Array.from({ length: maxRows }, (_, rowIndex) => {
      let guessToRender = null;
      let isActiveRow = false;
      
      if (guesses.length < maxRows) {
        if (rowIndex < guesses.length) {
          guessToRender = guesses[rowIndex];
        } else if (rowIndex === guesses.length && round.roundStatus === 'IN_PROGRESS') {
          isActiveRow = true;
        }
      } else {
        if (rowIndex < maxRows - 1) {
          guessToRender = guesses[rowIndex];
        } else {
          isActiveRow = round.roundStatus === 'IN_PROGRESS';
          if (!isActiveRow) {
            guessToRender = guesses[guesses.length - 1];
          }
        }
      }
      
      if (guessToRender) return this._buildGuessRow(guessToRender, wordLength);
      if (isActiveRow) return this._buildActiveRow(maskedWord);
      return this._buildEmptyRow(wordLength);
    });
  }
  
  _buildGuessRow(guess, wordLength) {
    const letters = guess.word.split('');
    const feedbacks = guess.letterFeedbacks ?? [];
    return Array.from({ length: wordLength }, (_, i) => {
      const fb = feedbacks.find(f => f.index === i);
      return {
        letter: letters[i] ?? '',
        status: fb?.letterFeedbackStatus ?? 'EMPTY'
      };
    });
  }
  
  _buildActiveRow(maskedWord) {
    return Array.from({ length: maskedWord.length }, (_, i) => ({
      letter: maskedWord[i] !== '_' ? maskedWord[i] : '',
      status: maskedWord[i] !== '_' ? 'REVEALED' : 'EMPTY'
    }));
  }
  
  _buildEmptyRow(wordLength) {
    return Array.from({ length: wordLength }, () => ({
      letter: '',
      status: 'EMPTY'
    }));
  }
}