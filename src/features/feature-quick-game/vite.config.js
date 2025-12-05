import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../../feature-quick-game/dist',
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/feature-quick-game-view.js'),
            name: 'feature-quick-game',
            formats: ['es']
        }
    },
    resolve: {
        alias: {
            '@quick-game': path.resolve(__dirname, './feature-quick-game/src')
        }
    },
    server: {
        port: 5102,
        open: false
    }
});