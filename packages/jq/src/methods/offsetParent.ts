import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './map';
import './css';
import { isElement } from '../utils';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 返回最近的用于定位的父元素，
     * 即父元素中第一个 position 为 relative 或 absolute 的元素
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
 * @returns {*|JQ}
 */
$.fn.offsetParent = function(this: JQ): JQ {
  return this.map(function() {
    if (!isElement(this)) {
      return new JQ();
    }

    let parent = this.offsetParent;

    while (
      parent &&
      isElement(parent) &&
      $(parent).css('position') === 'static'
    ) {
      parent = parent.offsetParent;
    }

    return parent || document.documentElement;
  });
};
