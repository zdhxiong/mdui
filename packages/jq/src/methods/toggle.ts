import $ from '../$';
import { JQ } from '../JQ';
import { getComputedStyleValue } from '../utils';
import './each';
import './hide';
import './show';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
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
 */
$.fn.toggle = function(this: JQ): JQ {
  return this.each(function() {
    getComputedStyleValue(this, 'display') === 'none'
      ? $(this).show()
      : $(this).hide();
  });
};
