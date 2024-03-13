import type { BrowserWindowConstructorOptions } from 'electron';
import type { Customize } from '@youliso/electronic/types';
import {
  logOn,
  fileOn,
  pathOn,
  machineOn,
  appBeforeOn,
  appOn,
  appProtocolRegister,
  storeInstance,
  shortcutInstance,
  windowInstance,
  Session,
  createTray,
  logError
} from '@youliso/electronic/main';
import { Update } from '@youliso/electronic/main/update';
import { join } from 'path';
import { app } from 'electron';
import updateCfg from '@/cfg/update.json';
import logo from '@/assets/icon/logo.png';

// 初始渲染进程参数
let customize: Customize = {
  title: 'electron-template',
  route: '/home'
};

// 初始窗口参数
let browserWindowOptions: BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  titleBarStyle: 'hidden',
  frame: true,
  show: false
};

// 设置窗口管理默认参数
if (!app.isPackaged) {
  // 调试模式
  if (browserWindowOptions.webPreferences) {
    browserWindowOptions.webPreferences.devTools = true;
  } else {
    browserWindowOptions.webPreferences = {
      devTools: true
    };
  }
  try {
    import('fs').then(({ readFileSync }) => {
      import('path').then(({ join }) => {
        windowInstance.setDefaultCfg({
          defaultLoadType: 'url',
          defaultUrl: `http://localhost:${readFileSync(join('.port'), 'utf8')}`,
          defaultPreload: join(__dirname, '../preload/index.js'),
          defaultCustomize: customize,
          defaultBrowserWindowOptions: browserWindowOptions
        });
      });
    });
  } catch (e) {
    throw 'not found .port';
  }
} else {
  windowInstance.setDefaultCfg({
    defaultLoadType: 'file',
    defaultUrl: join(__dirname, '../renderer/index.html'),
    defaultPreload: join(__dirname, '../preload/index.js'),
    defaultCustomize: customize,
    defaultBrowserWindowOptions: browserWindowOptions
  });
}

// 应用初始化之前监听和多窗口处理
appBeforeOn({
  additionalData: { type: 'new' },
  isFocusMainWin: true
});

// 注册协议
appProtocolRegister();

app
  .whenReady()
  .then(async () => {
    // 模块监听
    appOn();
    logOn();
    fileOn();
    pathOn();
    machineOn();
    // 创建托盘
    const tray = createTray({
      name: app.getName(),
      iconPath: logo as string
    });
    // 创建更新
    const update = new Update(
      { provider: updateCfg.provider as any, url: updateCfg.url },
      'scripts/dev-update.yml',
      updateCfg.dirname
    );
    // 创建session
    const session = new Session();
    storeInstance.on();
    windowInstance.on();
    shortcutInstance.on();
    tray.on('click', () => windowInstance.func('show'));
    update.on();
    session.on();

    // 创建窗口
    const win = windowInstance.create(customize, browserWindowOptions);
    win && windowInstance.load(win, { openDevTools: !app.isPackaged }).catch(logError);
  })
  .catch(logError);
