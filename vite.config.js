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
        port: 5173,
        strictPort: true,
        fs: {
            // Allow Vite dev server to access outside src
            allow: [
                '.',
                '../features/'
            ],
        },
    },
});