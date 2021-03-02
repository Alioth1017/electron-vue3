import { resolve } from 'path';
import {BuildOptions} from "esbuild";

export default (env = 'production') => {
    const config: BuildOptions = {
        entryPoints: [resolve('./src/main/index.ts')], // 入口文件
        outfile: resolve('dist/main.js'),
        format: 'cjs',
        logLevel: "info",
        errorLimit: 0,
        incremental: true,
        platform: "node",
        sourcemap: env === 'development',
    };
    return config;
};