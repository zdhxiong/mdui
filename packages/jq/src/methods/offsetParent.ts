import $ from '../$.js';
import { JQ } from '../JQ.js';
import './css.js';
import './map.js';

declare module '../JQ.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回最近的用于定位的父元素
     *
     * 即父元素中第一个 `position` 为 `relative`, `absolute` 或 `fixed` 的元素
     * @example
```js
$('.box').offsetParent()
```
     */
    offsetParent(): this;
  }
}

/**
 * 返回最近的用于定位的父元素
 */
$.fn.offsetParent = function (this: JQ): JQ {
  return this.map(function () {
    let offsetParent = this.offsetParent as HTMLElement;

    while (offsetParent && $(offsetParent).css('position') === 'static') {
      offsetParent = offsetParent.offsetParent as HTMLElement;
    }

    return offsetParent || document.documentElement;
  });
};
