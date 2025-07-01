import { $ } from '../$.js';
import { getStyle } from '../shared/css.js';
import './each.js';
import './hide.js';
import './show.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 切换集合中所有元素的显示状态
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
$.fn.toggle = function (this: JQ): JQ {
  return this.each((_, element) => {
    if (getStyle(element, 'display') === 'none') {
      $(element).show();
    } else {
      $(element).hide();
    }
  });
};
