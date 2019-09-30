import $ from '../$';
import map from '../functions/map';
import { JQ } from '../JQ';
import TypeOrArray from '../types/TypeOrArray';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 为当前 JQ 对象的每个元素都调用一个函数，生成一个包含函数返回值的新的 JQ 对象。null 和 undefined 会被过滤掉。
     * @param callback
     * @example
```js
const result = $('input.checked').map(function (i, element) {
  return $(this).val();
});
// result 为匹配元素的值组成的 JQ 对象
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

$.fn.map = function(
  this: JQ<any>,
  callback: (this: any, index: number, element: any) => null | undefined | any,
): JQ {
  return new JQ(map(this, (element, i) => callback.call(element, i, element)));
};
