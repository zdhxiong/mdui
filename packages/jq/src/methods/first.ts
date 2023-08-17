import { $ } from '../$.js';
import './eq.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 返回当前集合中第一个元素的集合。
     * @example
```js
$('div').first()
```
     */
    first(): this;
  }
}

$.fn.first = function (this: JQ): JQ {
  return this.eq(0);
};
