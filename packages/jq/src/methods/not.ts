import { $ } from '../$.js';
import './filter.js';
import './map.js';
import './index.js';
import type { JQ } from '../shared/core.js';
import type { Selector, TypeOrArray } from '../shared/helper.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 从当前集合中筛选出与表达式不匹配的元素
     * @param selection
     * 可以是 CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象、或返回 `boolean` 值的回调函数。
     *
     * 参数为回调函数时，回调函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素。
     *
     * 回调函数返回 `true` 时，将移除当前元素；返回 `false` 时，将保留当前元素。
     * @example
```js
// 筛选出所有不含 .box 类的 div 元素
$('div').not('.box')
```
     * @example
```js
// 筛选出所有未选中的元素
$('#select option').not(function (idx, element) {
  return element.selected;
})
```
     */
    not(
      selection:
        | Selector
        | TypeOrArray<Element>
        | JQ
        | ((this: T, index: number, element: T) => boolean),
    ): this;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.not = function (this: JQ, selector: any): JQ {
  const $excludes = this.filter(selector);

  return this.map((_, element) => {
    return $excludes.index(element) > -1 ? undefined : element;
  });
};
