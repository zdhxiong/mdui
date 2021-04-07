import $ from '../$.js';
import { JQ } from '../JQ.js';
import './each.js';

declare module '../JQ.js' {
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
  return this.each(function () {
    this.style.display = 'none';
  });
};
