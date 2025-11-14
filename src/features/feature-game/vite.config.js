import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../../feature-playing/dist',
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/playing-view.js'),
            name: 'feature-playing',
            // fileName: 'feature-playing.js' by default
            formats: ['es']
        }
    },
    resolve: {
        alias: {
            '@playing': path.resolve(__dirname, './feature-playing/src')
        }
    },
    server: {
        port: 5102,
        open: false
    }
});