import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';
import path from 'path';
import preact from '@preact/preset-vite';

export default defineConfig({
  root: './', // app-shell source root
  base: './', // Relative path
  define: {
    __APP_NAME__: JSON.stringify('letter-limbo-app'),
    global: 'window'
  },
  optimizeDeps: {
    include: ['sockjs-client']
  },
  build: {
    outDir: 'dist', // Output relative to project root
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Main entry
      plugins: [
        inject({
          global: ['window', 'global']
        })
      ]
    },
  },
  plugins: [preact()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    /**
     * For development purpose handle CORS and avoid hardcoding backend URLs
     */
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug'
      },
      '/ws-game': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
        logLevel: 'debug'
      }
    },
    historyApiFallback: true,
    fs: {
      // Allow Vite dev server to access outside src
      allow: [
        '..',
        './packages/common',
        '../features/'
      ],
    },
  },
});