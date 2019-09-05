import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 返回一个 JQ 对象的子集
     * 子集为从 start 开始的元素。如果传入了 end 参数，则提取从 start 到不包含 end 位置的元素。
     * @param start
     * @param end
     * @example ````返回对象中第三个（包含第三个）之后的所有元素
```js
$('div').slice(3);
```
     * @example ```返回对象中第三个到第五个（包含第三个，不包含第五个）之间的元素
```js
$('div').slice(3, 5);
```
     */
    slice(start: number, end?: number): this;
  }
}

$.fn.slice = function(this: JQ, ...args: [number, number?]): JQ {
  return new JQ([].slice.apply(this, args));
};
