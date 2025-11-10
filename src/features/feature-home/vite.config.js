import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: './src', // source files
    build: {
        outDir: '../../feature-home/dist',       // build output relative to feature folder
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/home-view.js'), // entry JS
            name: 'featureHome',       // optional global name
            // fileName: 'featurehome.js' by default
            formats: ['es'],           // ES module
        }
    },
    server: {
        port: 5100,
        open: false
    }
});