import { LitElement, html } from 'lit';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WsSendTestView extends LitElement {
  static properties = { messages: { state: true } };
  
  constructor() {
    super();
    this.messages = [];
    this.wsClient = null;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this._connectWebSocket();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.client) this.client.deactivate();
  }
  
  _connectWebSocket() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-game'),
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });
    
    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.client.subscribe('/topic/greetings', (msg) => {
        this.messages = [...this.messages, msg.body];
        console.log('Received:', msg.body);
      });
    };
    
    this.client.activate();
  }
  
  _sendMessage() {
    if (this.client && this.client.connected) {
      this.client.publish({ destination: '/app/hello', body: 'Hello from frontend!' });
    }
  }
  
  render() {
    return html`
      <h2>WebSocket Test Send</h2>
      <button @click=${this._sendMessage}>Send Message</button>
      <ul>
        ${this.messages.map(msg => html`<li>${msg}</li>`)}
      </ul>
    `;
  }
}

customElements.define('ws-send-test-view', WsSendTestView);