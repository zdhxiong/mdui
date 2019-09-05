import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './each';
import { isElement } from '../utils';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 切换当前元素的显示状态
     * @example
```js
$('.box').toggle()
```
     */
    toggle(): this;
  }
}

/**
 * 切换元素的显示状态
 * @returns {JQ}
 */
$.fn.toggle = function(this: JQ): JQ {
  return this.each(function() {
    if (!isElement(this)) {
      return;
    }

    this.style.display = this.style.display === 'none' ? '' : 'none';
  });
};
