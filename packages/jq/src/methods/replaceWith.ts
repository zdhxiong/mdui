import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './before';
import './remove';
import JQSelector from '../types/JQSelector';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 用新元素替换当前元素
     * @param newContent
     * @example ````用 <p>Hello</p> 替换所有的 .box 元素
```js
$('.box').replaceWith('<p>Hello</p>')
```
     */
    replaceWith(newContent: JQSelector): this;
  }
}

$.fn.replaceWith = function(this: JQ, newContent: JQSelector): JQ {
  return this.before(newContent).remove();
};
