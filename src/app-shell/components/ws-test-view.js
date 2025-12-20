import { LitElement, html } from 'lit';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WsTestView extends LitElement {
  static properties = {
    messages: { state: true }
  };
  
  constructor() {
    super();
    this.messages = [];
  }
  
  createRenderRoot() { return this; }
  
  connectedCallback() {
    super.connectedCallback();
    this._connectWebSocket();
  }
  
  _connectWebSocket() {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-game'),
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });
    
    client.onConnect = () => {
      console.log('WebSocket connected');
      
      // Subscribe to the test topic
      client.subscribe('/topic/greetings', (message) => {
        const body = message.body;
        console.log('Received:', body);
        this.messages = [...this.messages, body]; // <-- update reactive property
      });
      
      // Send a test message
      client.publish({ destination: '/app/hello', body: 'Player1' });
    };
    
    client.activate();
  }
  
  render() {
    return html`
      <h2>WebSocket Test</h2>
      <ul>
        ${this.messages.map(msg => html`<li>${msg}</li>`)}
      </ul>
    `;
  }
}

customElements.define('ws-test-view', WsTestView);