import { $ } from '../$.js';
import { eachArray } from '../shared/helper.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 遍历当前集合，为集合中每一个元素执行一个函数。
     * @param callback
     * 执行的回调函数
     *
     * 函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素
     *
     * 如果函数返回 `false`，则结束遍历。
     * @example
```js
$('img').each(function (index, element) {
  this.src = 'test' + index + '.jpg';
});
```
     */
    each(callback: (this: T, index: number, element: T) => unknown): this;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.each = function (this: JQ, callback: void | any): JQ {
  return eachArray(this, (value, index) => {
    return callback.call(value, index, value);
  }) as JQ;
};
