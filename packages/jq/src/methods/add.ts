import $ from '../$';
import { JQ } from '../JQ';
import unique from '../functions/unique';
import merge from '../functions/merge';
import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 添加元素到当前 JQ 对象中
     * @param selector 可以是 HTML 字符串、CSS 选择器、JQ 对象、DOM 元素、DOM 元素数组、NodeList 等
     * @example ````把含 .selected 的元素添加到当前 JQ 对象中
```js
$('.box').add('.selected');
```
     */
    add(selector: JQSelector): this;
  }
}

$.fn.add = function(this: JQ, selector: JQSelector): JQ {
  return new JQ(unique(merge(this.get(), $(selector).get())));
};
