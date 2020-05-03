import $ from '../$';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import { isFunction, isString } from '../utils';
import './is';
import './map';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 从当前对象中筛选出与指定表达式匹配的元素
     * @param selector
     * 可以是 CSS 表达式、DOM 元素、DOM 元素数组、或回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素
     *
     * 回调函数返回 `true` 时，对应元素会被保留；返回 `false` 时，对应元素会被移除
     * @example
```js
// 筛选出所有含 .box 的 div 元素
$('div').filter('.box');
```
     * @example
```js
// 筛选出所有已选中的元素
$('#select option').filter(function (idx, element) {
  return element.selected;
});
```
     */
    filter(
      selector:
        | Selector
        | TypeOrArray<Element>
        | JQ
        | ((this: T, index: number, element: T) => boolean),
    ): this;
  }
}

$.fn.filter = function (this: JQ, selector: any): JQ {
  if (isFunction(selector)) {
    return this.map((index, element) =>
      selector.call(element, index, element) ? element : undefined,
    );
  }

  if (isString(selector)) {
    return this.map((_, element) =>
      $(element).is(selector) ? element : undefined,
    );
  }

  const $selector = $(selector);

  return this.map((_, element) =>
    $selector.get().indexOf(element) > -1 ? element : undefined,
  );
};
