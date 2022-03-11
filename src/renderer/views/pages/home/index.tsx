import { ref, revokeProxy } from '@/renderer/common/store';
import { getCustomize } from '@/renderer/store';
import Router from '@/renderer/router';
import {
  windowCreate,
  windowMessageOn,
  windowMessageRemove,
  windowShow
} from '@/renderer/common/window';
import { shortcutGetAll } from '@/renderer/common/shortcut';
import { menuShow } from '@/renderer/common/menu';
import { getResourcesPath } from '@/renderer/common/app';
import { readFile } from '@/renderer/common/file';
import style from './style';

const args = getCustomize();

export default class Home {
  private fileData: RefValue<string> | undefined;
  private fileInterval: NodeJS.Timer | undefined;
  private testData: RefValue<string> | undefined;
  private testInterval: NodeJS.Timer | undefined;

  onLoad() {
    this.onTest();
  }

  onReady() {
    windowShow();
  }

  onUnmounted() {
    if (this.testData) revokeProxy('test');
    if (this.testInterval) clearInterval(this.testInterval);
    if (this.fileData) revokeProxy('file');
    if (this.fileInterval) clearInterval(this.fileInterval);
    this.unTest();
  }

  onTest() {
    windowMessageOn('test', (_, args) => {
      console.log(args);
    });
  }

  unTest() {
    windowMessageRemove('test');
  }

  testRender() {
    this.testData = ref('test', Date(), (value) => (test.textContent = value));
    const test = <div class="test">{this.testData.value}</div>;
    this.testInterval = setInterval(() => {
      (this.testData as RefValue<string>).value = Date();
    }, 1000);
    return test;
  }

  testfile() {
    this.fileData = ref('file', Date(), (value) => (test.textContent = value));
    const test = <div class="test">{this.fileData.value}</div>;
    getResourcesPath('inside', 't.txt').then((e) => {
      readFile(e, { encoding: 'utf8' }).then((req) => {
        this.fileData!.value = req;
      });
    });
    return test;
  }

  render() {
    function tk() {
      windowCreate(
        {
          title: '弹框测试',
          route: '/message',
          parentId: args.id,
          data: { text: '123' }
        },
        {
          width: 440,
          height: 220,
          modal: true,
          resizable: true
        }
      );
    }

    function baidu() {
      windowCreate(
        {
          url: 'https://baidu.com/',
          parentId: args.id
        },
        {
          width: 1280,
          height: 720
        }
      );
    }

    getResourcesPath('inside', 't.txt').then((e) => console.log(e));

    return (
      <div class={style} onMouseDown={(e) => e.button === 2 && menuShow()}>
        {this.testRender()}
        {this.testfile()}
        <button class="but" onClick={() => baidu()}>
          百度
        </button>
        <button class="but" onClick={() => tk()}>
          弹框
        </button>
        <button class="but" onClick={() => shortcutGetAll().then(console.log)}>
          获取已注册shortcut
        </button>
        <button class="but" onClick={() => Router.push('/about')}>
          关于
        </button>
        <button class="but" onClick={() => Router.push('/music')}>
          music
        </button>
      </div>
    );
  }
}
