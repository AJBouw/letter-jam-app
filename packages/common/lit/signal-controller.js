export class SignalController {
  constructor(host, signals = []) {
    this.host = host;
    this._unsubscribe = signals.map(sig =>
      sig.subscribe(() => host.requestUpdate())
    );
  }
  
  disconnect() {
    this._unsubscribe.forEach(unsubscribe => unsubscribe());
  }
}