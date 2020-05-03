import $ from '../$';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import './clone';
import './get';
import './map';
import './replaceWith';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 用当前集合中的元素替换指定元素
     * @param target 被替换的元素。可以是 CSS 选择器、DOM 元素、DOM 元素数组、或 JQ 对象
     * @returns 用于替换的元素的集合
     * @example
```js
// 用 .new 元素替换所有 .box 元素
$('.new').replaceAll('.box');
```
     */
    replaceAll(target: Selector | TypeOrArray<Element> | JQ): this;
  }
}

$.fn.replaceAll = function (this: JQ, target: any): JQ {
  return $(target).map((index, element) => {
    $(element).replaceWith(index ? this.clone() : this);

    return this.get();
  });
};
