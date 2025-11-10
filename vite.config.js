import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './', // app-shell source root
    base: './', // Relative path
    build: {
        outDir: 'dist', // Output relative to project root
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'index.html'), // Main entry
        },
    },
    // resolve: {
    //     alias: {
    //         '@features': path.resolve(__dirname, './src/features')
    //     }
    // },
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
        proxy: {
            '/games': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        },
        fs: {
            // Allow Vite dev server to access outside src
            allow: [
                '.',
                '../features/'
            ],
        },
    },
});