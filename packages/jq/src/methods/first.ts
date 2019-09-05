import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './eq';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 返回当前对象中第一个元素的 JQ 对象。
     * @example
```js
$('div').first()
```
     */
    first(): this;
  }
}

$.fn.first = function(this: JQ): JQ {
  return this.eq(0);
};
