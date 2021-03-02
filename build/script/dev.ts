import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createServer, InlineConfig } from 'vite';
import { build } from 'esbuild';
import mainCfg from './main.config';
import rendererCfg from './renderer.config';

let electronProcess: ChildProcessWithoutNullStreams | null;
let manualRestart = false;

async function startRenderer() {
    const cfg = rendererCfg as InlineConfig;
    const server = await createServer({
        ...cfg,
        configFile: false,
        logLevel: 'info',
        plugins: [...(cfg.plugins ?? [])]
    });
    await server.listen();
    // console.log(`Dev server running at: localhost:${cfg.server.port}`);
}

async function startMain() {
    return new Promise((resolve) => {
        build({
            ... mainCfg('development'),
            watch: {
                onRebuild: (error) => {
                    if (!!error) {
                        console.error(error);
                    } else {
                        if (electronProcess && electronProcess.kill) {
                            manualRestart = true;
                            process.kill(electronProcess.pid);
                            electronProcess = null;
                            startElectron();
                            setTimeout(() => {
                                manualRestart = false;
                            }, 5000);
                        }
                    }
                },
            }
        }).then(()=>{
            resolve(1);
        });
    });
}

function startElectron() {
    let args = [
        'dist/main.js'
    ];
    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args = args.concat(process.argv.slice(3));
    } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args = args.concat(process.argv.slice(2));
    }
    console.log(args)
    electronProcess = spawn('electron', args);
    electronProcess.stdout.on('data', data => console.log('[main:stdout]', data.toString()));
    electronProcess.stderr.on('data', data => console.log('[main:stderr]', data.toString()));
    electronProcess.on('exit', (e) => {
        console.log('exit', e);
    });
    electronProcess.on('close', () => {
        if (!manualRestart) process.exit();
    });
}

async function init() {
    await startRenderer();
    await startMain();
    startElectron();
}

init().then();
