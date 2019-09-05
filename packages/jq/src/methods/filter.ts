import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { isFunction } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './map';
import './index';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 从当前对象中筛选出与指定表达式匹配的元素
     * 参数为函数时，函数返回 true 时，该元素会被保留，返回 false 时，该元素会被移除。
     * @param selector
     * @example ````筛选出所有含 .box 的 div 元素
```js
$('div').filter('.box');
```
     * @example ````筛选出所有已选中的元素
```js
$('#select option').filter(function (idx, element) {
  return element.selected;
});
```
     */
    filter(
      selector: JQSelector | ((this: T, index: number, element: T) => boolean),
    ): this;
  }
}

$.fn.filter = function(this: JQ, selector: any): JQ {
  if (isFunction(selector)) {
    return this.map((index, element) =>
      selector.call(element, index, element) ? element : undefined,
    );
  }

  const $selector = $(selector);

  return this.map((_, element) =>
    $selector.index(element) > -1 ? element : undefined,
  );
};
