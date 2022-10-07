import { $ } from '../$.js';
import './each.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 移除当前元素中所有的子元素
     * @example
```js
$('.box').empty()
```
     */
    empty(): this;
  }
}

$.fn.empty = function (this: JQ): JQ {
  return this.each((_, element) => {
    element.innerHTML = '';
  });
};
