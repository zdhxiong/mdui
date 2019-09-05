import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import map from '../functions/map';

declare module '../JQ' {
  interface JQ<T = JQElement> {
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
    map(
      callback: (this: T, index: number, element: T) => null | undefined | any,
    ): this;
  }
}

$.fn.map = function(
  this: JQ,
  callback: (
    this: JQElement,
    index: number,
    element: JQElement,
  ) => null | undefined | any,
): JQ {
  return new JQ(map(this, (element, i) => callback.call(element, i, element)));
};
