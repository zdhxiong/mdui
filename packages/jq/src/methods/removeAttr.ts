import JQElement from '../types/JQElement';
import { isElement } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 移除指定属性
     * @param attributeName
     * @example
```js
$('div').removeAttr('title')
```
     */
    removeAttr(attributeName: string): this;
  }
}

$.fn.removeAttr = function(this: JQ, attributeName: string): JQ {
  return this.each(function() {
    if (isElement(this)) {
      this.removeAttribute(attributeName);
    }
  });
};
