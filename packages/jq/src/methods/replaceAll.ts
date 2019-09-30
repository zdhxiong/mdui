import $ from '../$';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import './get';
import './map';
import './replaceWith';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 用当前元素替换指定元素
     * @param target
     * @returns 用于替换的元素的集合
     * @example ````用 .new 元素替换所有 .box 元素
```js
$('.new').replaceAll('.box');
```
     */
    replaceAll(target: Selector | TypeOrArray<Element> | JQ): this;
  }
}

$.fn.replaceAll = function(this: JQ, target: any): JQ {
  return $(target).map((_, element) => {
    $(element).replaceWith(this);

    return this.get();
  });
};
