import { $ } from '../$.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 判断集合中的第一个元素是否含有指定 CSS 类。
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
