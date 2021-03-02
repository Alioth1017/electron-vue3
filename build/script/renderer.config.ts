import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import externals from 'rollup-plugin-node-externals';
import { resolve } from 'path';

export default defineConfig({
    root: resolve('./src/renderer'),
    plugins: [
        vue()
    ],
    server: {
        port: 3346
    },
    resolve: {
        alias: {
            '@': resolve('src')
        }
    },
    optimizeDeps: {
        exclude: []
    },
    build: {
        outDir: resolve('dist'),
        sourcemap: true,
        minify: false,
        rollupOptions: {
            external: ['electron'],
            plugins: [
                externals()
                // cjs2esm(),
            ]
        }
    },
    esbuild: {
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    }
});