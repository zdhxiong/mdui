import $ from '../$.js';
import { JQ } from '../shared/core.js';
import './each.js';

declare module '../shared/core.js' {
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
