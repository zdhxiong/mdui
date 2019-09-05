import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './each';
import { isElement } from '../utils';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 隐藏对象中所有元素
     * @example
```js
$('.box').hide();
```
     */
    hide(): this;
  }
}

$.fn.hide = function(this: JQ): JQ {
  return this.each(function() {
    if (isElement(this)) {
      this.style.display = 'none';
    }
  });
};
