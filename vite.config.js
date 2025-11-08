import {defineConfig} from 'vite';
import path from 'path';

const featureName = process.env.FEATURE_NAME || '';

export default defineConfig({
    base: '/',
    build: {
        // outDir: 'dist', // Output folder (relative to project root)
        outDir: featureName === 'app-shell' ? path.resolve(__dirname, '../../dist') : 'dist',
        emptyOutDir: true, // Clear old files before building
        sourcemap: false // Optional: generate source maps
    },
    rollupOptions: {
        // Optional: if you want multiple entry points (app-shell + features)
        input: {
            main: path.resolve(__dirname, 'index.html'),
            'feature-home': 'src/features/feature-home/feature-home.js',
            'feature-quick-game': 'src/features/feature-quick-game/feature-quick-game.js',
            'feature-login': 'src/features/feature-login/feature-login.js'

        }
    },

    // Adjust Vites dev server to work with DDEV
    // https://vitejs.dev/config/server-options.html
    resolve: {
        alias: {
            '/features/feature-home/dist': path.resolve(__dirname, './features/feature-home/dist'),
            '/features/feature-login/dist': path.resolve(__dirname, './features/feature-login/dist'),
            '/features/feature-quick-game/dist': path.resolve(__dirname, './features/feature-quick-game/dist'),
        }
    },
    server: {
        // Respond to all network requests
        host: "0.0.0.0",
        port: 5173,
        open: true, // Open browser automatically
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        },
        fs: {
            allow: [
                '.',
                '../features/'
            ]
        }
    },
})