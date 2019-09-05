import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import './parents';
import './eq';
import './is';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 从当前元素向上逐级匹配，返回最先匹配到的元素
     * @param selector
     * @example ````获取 .box 元素的父元素中最近的 .parent 元素
```js
$('.box').closest('.parent')
```
     */
    closest(selector: JQSelector): this;
  }
}

$.fn.closest = function(this: JQ, selector: JQSelector): JQ {
  if (this.is(selector)) {
    return new JQ();
  }

  return this.parents(selector).eq(0);
};
