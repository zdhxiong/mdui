import $ from '../$';
import { JQ } from '../JQ';
import './eq';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回当前集合中最后一个元素的 JQ 对象
     * @example
```js
$('div').last()
```
     */
    last(): this;
  }
}

$.fn.last = function (this: JQ): JQ {
  return this.eq(-1);
};
