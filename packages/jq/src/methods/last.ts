import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './eq';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 获取对象中最后一个元素
     * @example
```js
$('div').last()
```
     */
    last(): this;
  }
}

$.fn.last = function(this: JQ): JQ {
  return this.eq(-1);
};
