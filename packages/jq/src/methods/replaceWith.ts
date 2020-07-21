import $ from '../$';
import { JQ } from '../JQ';
import HTMLString from '../types/HTMLString';
import TypeOrArray from '../types/TypeOrArray';
import './before';
import './clone';
import './each';
import './remove';
import { isFunction, isString } from '../utils';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 用指定元素替换当前集合中的元素
     * @param newContent
     * 可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象、或回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为当前元素 HTML 字符串，`this` 指向当前元素
     * @returns 被替换掉的元素集
     * @example
```js
$('.box').replaceWith('<p>Hello</p>')
```
     * @example
```js
$('.box').replaceWith(function (index, html) {
  return html + index;
})
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

$.fn.replaceWith = function (this: JQ, newContent: any): JQ {
  this.each((index, element) => {
    let content = newContent;

    if (isFunction(content)) {
      content = content.call(element, index, element.innerHTML);
    } else if (index && !isString(content)) {
      content = $(content).clone();
    }

    $(element).before(content);
  });

  return this.remove();
};
