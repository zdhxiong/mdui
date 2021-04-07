import $ from '../$.js';
import { JQ } from '../JQ.js';
import './slice.js';

declare module '../JQ.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回 JQ 对象中指定索引位置的元素的 JQ 对象
     * @param index 元素的索引位置
     * @example
```js
// 返回第一个元素的 JQ 对象
$('div').eq(0);
```
     * @example
```js
// 返回最后一个元素的 JQ 对象
$('div').eq(-1);
```
     */
    eq(index: number): this;
  }
}

$.fn.eq = function (this: JQ, index: number): JQ {
  const ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);

  return new JQ(ret);
};
