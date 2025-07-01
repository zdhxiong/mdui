import { $ } from '../$.js';
import { isFunction, isString } from '../shared/helper.js';
import './is.js';
import './map.js';
import type { JQ } from '../shared/core.js';
import type { Selector, TypeOrArray } from '../shared/helper.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 从当前集合中筛选出与指定表达式匹配的元素
     * @param selector
     * 可以是 CSS 表达式、DOM 元素、DOM 元素数组、或回调函数
     *
     * 参数为回调函数时，回调函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素
     *
     * 回调函数返回 `true` 时，当前元素会被保留；返回 `false` 时，当前元素会被移除
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.filter = function (this: JQ, selector: any): JQ {
  if (isFunction(selector)) {
    return this.map((index, element) => {
      return selector.call(element, index, element) ? element : undefined;
    });
  }

  if (isString(selector)) {
    return this.map((_, element) => {
      return $(element).is(selector) ? element : undefined;
    });
  }

  const $selector = $(selector);

  return this.map((_, element) => {
    return $selector.get().includes(element) ? element : undefined;
  });
};
