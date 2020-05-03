import $ from '../$';
import { JQ } from '../JQ';
import './eq';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回当前集合中第一个元素的 JQ 对象
     * @example
```js
$('div').first()
```
     */
    first(): this;
  }
}

$.fn.first = function (this: JQ): JQ {
  return this.eq(0);
};
