import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    root: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/feature-quick-game.js'),
            name: 'feature-quick-game',
            fileName: 'feature-quick-game',
            formats: ['es']
        }
    },
    plugins: [
        viteSingleFile()
    ],
    server: {
        port: 5100,
        open: false
    }
});