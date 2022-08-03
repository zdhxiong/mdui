import type { JQ } from '../shared/core.js';
import { $ } from '../$.js';
import './eq.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 返回当前集合中最后一个元素的 JQ 对象
     * @example
```js
$('div').last()
```
     */
    last(): this;
  }
}

$.fn.last = function (this: JQ): JQ {
  return this.eq(-1);
};
