import $ from '../$';
import map from '../functions/map';
import { JQ } from '../JQ';
import TypeOrArray from '../types/TypeOrArray';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 为当前集合中的每个元素都调用一个函数，生成一个包含函数返回值的新的集合
     * @param callback
     * 执行的回调函数
     *
     * 函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素
     *
     * 函数可以返回单个数据或数据数组。若返回数组，则会将数组中的元素依次添加到新集合中
     *
     * 若函数返回 `null` 或 `undefined`，则不会添加到新集合中
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

$.fn.map = function (
  this: JQ<any>,
  callback: (this: any, index: number, element: any) => null | undefined | any,
): JQ {
  return new JQ(map(this, (element, i) => callback.call(element, i, element)));
};
