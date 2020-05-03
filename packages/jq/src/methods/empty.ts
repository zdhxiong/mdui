import $ from '../$';
import { JQ } from '../JQ';
import './each';

declare module '../JQ' {
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
  return this.each(function () {
    this.innerHTML = '';
  });
};
