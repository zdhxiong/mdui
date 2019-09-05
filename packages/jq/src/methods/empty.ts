import JQElement from '../types/JQElement';
import { isElement } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
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

$.fn.empty = function(this: JQ): JQ {
  return this.each(function() {
    if (isElement(this)) {
      this.innerHTML = '';
    }
  });
};
