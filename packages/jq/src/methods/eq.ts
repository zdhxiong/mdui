import $ from '../$';
import { JQ } from '../JQ';
import './slice';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回 JQ 对象中指定索引号的元素的 JQ 对象
     * @param index
     * @example ````返回第一个元素的 JQ 对象
```js
$('div').eq(0);
```
     * @example ````返回最后一个元素的 JQ 对象
```js
$('div').eq(-1);
```
     */
    eq(index: number): this;
  }
}

$.fn.eq = function(this: JQ, index: number): JQ {
  const ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);

  return new JQ(ret);
};
