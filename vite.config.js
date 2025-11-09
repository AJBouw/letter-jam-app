import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
    root: '.', // Where Vite considers the project's source entry
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false
    },
    rollupOptions: {
        input: {
            main: path.resolve(__dirname, 'index.html')
        }
    },

    server: {
        resolve: {
            alias: {
                '/features/feature-home/dist': path.resolve(__dirname, '../features/feature-home/dist'),
                '/features/feature-login/dist': path.resolve(__dirname, '../features/feature-login/dist'),
                '/features/feature-quick-game/dist': path.resolve(__dirname, '../features/feature-quick-game/dist'),
            }
        },
        host: "0.0.0.0",
        port: 5173,
        open: true,
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
                '../features/'
            ]
        }
    },
})