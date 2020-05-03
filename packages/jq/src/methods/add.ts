import $ from '../$';
import merge from '../functions/merge';
import unique from '../functions/unique';
import { JQ } from '../JQ';
import TypeOrArray from '../types/TypeOrArray';
import './get';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 添加元素到当前 JQ 对象中
     * @param selector 可以是 HTML 字符串、CSS 选择器、JQ 对象、DOM 元素、DOM 元素数组、NodeList 等
     * @example
```js
// 把含 .selected 的元素添加到当前 JQ 对象中
$('.box').add('.selected');
```
     */
    add(selector: string | TypeOrArray<Element> | JQ | null): this;
  }
}

$.fn.add = function (this: JQ, selector: any): JQ {
  return new JQ(unique(merge(this.get(), $(selector).get())));
};
