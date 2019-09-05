import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import './replaceWith';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 用当前元素替换指定元素
     * @param selector
     * @example ````用 .new 元素替换所有 .box 元素
```js
$('.new').replaceAll('.box');
```
     */
    replaceAll(selector: JQSelector): this;
  }
}

$.fn.replaceAll = function(this: JQ, selector: JQSelector): JQ {
  $(selector).replaceWith(this);

  return this;
};
