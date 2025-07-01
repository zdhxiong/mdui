import { $ } from '../$.js';
import { map } from '../functions/map.js';
import { JQ } from '../shared/core.js';
import type { TypeOrArray } from '../shared/helper.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 遍历当前集合，为集合中的每个元素都执行一个函数，返回由函数返回值组成的新集合。
     * @param callback
     * 执行的回调函数
     *
     * 函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素。
     *
     * 函数可以返回单个数据或数据数组。若返回数组，则会将数组中的元素依次添加到新集合中。
     *
     * 若函数返回 `null` 或 `undefined`，则不会添加到新集合中。
     * @example
```js
const result = $('input.checked').map(function (i, element) {
  return element.value;
});
```
     */
    map<TReturn>(
      callback: (
        this: T,
        index: number,
        element: T,
      ) => TypeOrArray<TReturn> | null | undefined,
    ): JQ<TReturn>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.map = function (this: JQ, callback: any): any {
  return new JQ(
    map(this, (element, i) => {
      return callback.call(element, i, element);
    }),
  );
};
