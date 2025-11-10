import '@webcomponents/scoped-custom-element-registry'; // polyfill first
import './app-shell.js';

const root = document.getElementById('app');
const app = document.createElement('app-shell');
root.appendChild(app);
