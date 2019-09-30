import $ from '../$';
import { JQ } from '../JQ';
import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import './before';
import './remove';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 用新元素替换当前元素
     * @param newContent
     * @returns 被删除的元素集
     * @example ````用 <p>Hello</p> 替换所有的 .box 元素
```js
$('.box').replaceWith('<p>Hello</p>')
```
     */
    replaceWith(
      newContent:
        | HTMLString
        | TypeOrArray<Element>
        | JQ
        | ((
            this: T,
            index: number,
            oldHtml: string,
          ) => HTMLString | TypeOrArray<Element> | JQ),
    ): this;
  }
}

$.fn.replaceWith = function(this: JQ, newContent: any): JQ {
  return this.before(newContent).remove();
};
