import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
    base: '/',
    build: {
        outDir: 'dist', // Output folder (relative to project root)
        emptyOutDir: true, // Clear old files before building
        sourcemap: false // Optional: generate source maps
    },
    rollupOptions: {
        // Optional: if you want multiple entry points (app-shell + features)
        input: {
            main: path.resolve(__dirname, 'index.html')

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