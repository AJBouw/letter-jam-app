import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../../feature-quick-start/dist',
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/quick-start-view.js'),
            name: 'feature-quick-start',
            // fileName: 'featurequickstart.js' by default
            formats: ['es']
        }
    },
    resolve: {
        alias: {
            '@quick-start': path.resolve(__dirname, './feature-quick-start/src')
        }
    },
    server: {
        port: 5102,
        open: false
    }
});