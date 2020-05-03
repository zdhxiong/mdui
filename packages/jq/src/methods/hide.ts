import $ from '../$';
import { JQ } from '../JQ';
import './each';

declare module '../JQ' {
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
