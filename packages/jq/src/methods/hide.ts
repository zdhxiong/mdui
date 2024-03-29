import { $ } from '../$.js';
import './each.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 隐藏集合中所有元素
     * @example
```js
$('.box').hide();
```
     */
    hide(): this;
  }
}

$.fn.hide = function (this: JQ): JQ {
  return this.each((_, element) => {
    element.style.display = 'none';
  });
};
