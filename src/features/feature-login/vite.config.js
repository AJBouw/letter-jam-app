import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './src',
    build: {
        outDir: '../../feature-login/dist',
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/login-view.js'),
            name: 'feature-login',
            // fileName: 'featurelogin.js' by default
            formats: ['es']
        }
    },
    resolve: {
        alias: {
            '@login': path.resolve(__dirname, './feature-login.src')
        }
    },
    server: {
        port: 5101,
        open: false
    }
});