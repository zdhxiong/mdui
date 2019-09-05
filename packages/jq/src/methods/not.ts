import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import './map';
import './filter';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 从当前对象中筛选出与表达式不匹配的元素
     * 参数为函数时，函数返回 true 时，该元素会被移除，返回 false 时，该元素会被保留。
     * @param selection
     * @example ````筛选出所有不含 .box 类的 div 元素
```js
$('div').not('.box')
```
     * @example ````筛选出所有未选中的元素
```js
$('#select option').not(function (idx, element) {
  return element.selected;
})
```
     */
    not(selection: JQSelector): this;
  }
}

$.fn.not = function(this: JQ, selector: JQSelector): JQ {
  const $excludes = this.filter(selector);

  return this.map((index, element) =>
    $excludes.index(element) > -1 ? undefined : element,
  );
};
