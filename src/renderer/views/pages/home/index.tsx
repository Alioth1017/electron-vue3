import { proxy } from '@/renderer/common/proxy';
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
import style from './style';

const args = getCustomize();

function useProxy(str: string): [ProxyValue<string>, JSX.Element] {
  const dom = <span>{str}</span>;
  const data = proxy(str, (value) => (dom.textContent = value));
  return [data, dom];
}

export default class Home {
  private fileInterval: NodeJS.Timer | undefined;
  private testInterval: NodeJS.Timer | undefined;

  onLoad() {
    this.onTest();
  }

  onReady() {
    windowShow();
  }

  onUnmounted() {
    if (this.testInterval) clearInterval(this.testInterval);
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
    const [data, dom] = useProxy(Date());
    this.testInterval = setInterval(() => {
      data.value = Date();
    }, 1000);
    return <div class="text">{dom}</div>;
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

    return (
      <div class={style} onMouseDown={(e) => e.button === 2 && menuShow()}>
        {this.testRender()}
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
