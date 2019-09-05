import JQElement from '../types/JQElement';
import { isElement } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 从 DOM 中移除选中的元素
     * @example ````移除 DOM 中所有 p 元素
```js
$('p').remove()
```
     */
    remove(): this;
  }
}

$.fn.remove = function(this: JQ): JQ {
  return this.each((_, element) => {
    if (isElement(element) && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
};
