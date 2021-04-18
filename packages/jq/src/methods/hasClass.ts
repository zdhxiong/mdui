import $ from '../$.js';
import { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  interface JQ {
    /**
     * 是否含有指定的 CSS 类
     * @param className CSS 类名
     * @example
```js
$('div').hasClass('item')
```
     */
    hasClass(className: string): boolean;
  }
}

$.fn.hasClass = function (this: JQ, className: string): boolean {
  return this[0].classList.contains(className);
};
