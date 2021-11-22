import { getCustomize } from '@/renderer/store';
import { domCreateElement, Component } from '@/renderer/common/dom';
import { getGlobal } from '@/renderer/common';
import { windowClose, windowMaxMin, windowMin } from '@/renderer/common/window';
import indexCss from './scss/index.lazy.scss';

const args = getCustomize();

export default class Head extends Component {
  styles = [indexCss];
  isHead: boolean;

  constructor(isHead: boolean = true) {
    super();
    this.isHead = isHead;
  }

  onLoad() {}

  onReady() {}

  onUnmounted() {}

  events(content: HTMLDivElement) {
    const events = domCreateElement('div', 'events');
    const min = domCreateElement('div', 'event min no-drag');
    const maxMin = domCreateElement('div', 'event max-min no-drag');
    const close = domCreateElement('div', 'event close no-drag');
    min.addEventListener('click', () => windowMin());
    maxMin.addEventListener('click', () => windowMaxMin());
    close.addEventListener('click', () => windowClose());
    events.appendChild(min);
    events.appendChild(maxMin);
    events.appendChild(close);
    if (this.isHead) content.appendChild(events);
  }

  render() {
    const el = domCreateElement('div', 'head-info drag');
    const content = domCreateElement('div', 'content');
    getGlobal<string>('system.platform').then(async (platform) => {
      const title = domCreateElement(
        'div',
        'title',
        args.title || (await getGlobal<string>('app.name'))
      );
      if (platform === 'darwin') {
        content.appendChild(document.createElement('div'));
        content.appendChild(title);
      } else {
        content.appendChild(title);
        this.events(content);
      }
    });
    el.appendChild(content);
    return el;
  }
}
