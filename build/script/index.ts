import fs from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

export function deleteFolderRecursive(url) {
    let files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function(file, index) {
            let curPath = join(url, file);
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    }
}

export function build() {
    let args = [
        'build',
        '-c build/script/renderer.config.ts'
    ];
    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args = args.concat(process.argv.slice(3));
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2));
    }
    const Process = spawn('vite', args);
    Process.stdout.on('data', data => console.log('[build]', data.toString()));
    Process.stderr.on('data', data => console.error('[build]', data.toString()));
}