import $ from '../$';
import { JQ } from '../JQ';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 返回一个当前集合的子集
     *
     * 子集为从 start 开始的元素。若指定了 end 参数，则提取从 start 到不包含 end 位置的元素
     * @param start 从该位置开始
     * @param end 到该位置结束（不包含该位置）
     * @example
```js
返回集合中第三个（包含第三个）之后的所有元素
$('div').slice(3);
```
     * @example
```js
// 返回集合中第三个到第五个（包含第三个，不包含第五个）之间的元素
$('div').slice(3, 5);
```
     */
    slice(start: number, end?: number): this;
  }
}

$.fn.slice = function (this: JQ, ...args: [number, number?]): JQ {
  return new JQ([].slice.apply(this, args));
};
