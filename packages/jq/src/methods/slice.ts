import { $ } from '../$.js';
import { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 返回当前集合的子集。
     *
     * 第一个参数为子集的起始位置，第二个参数为子集的结束位置（不包含结束位置的元素）；若未传入第二个参数，表示包含从起始位置到结尾的所有元素。
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
