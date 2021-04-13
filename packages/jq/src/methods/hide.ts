import $ from '../$.js';
import { JQ } from '../shared/core.js';
import './each.js';

declare module '../shared/core.js' {
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
