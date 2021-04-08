import $ from '../$.js';
import { JQ } from '../shared/core.js';
import './eq.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回当前集合中第一个元素的 JQ 对象
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
