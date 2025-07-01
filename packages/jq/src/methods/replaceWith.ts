import { $ } from '../$.js';
import { isFunction, isString } from '../shared/helper.js';
import './before.js';
import './clone.js';
import './each.js';
import './remove.js';
import type { JQ } from '../shared/core.js';
import type { HTMLString, TypeOrArray } from '../shared/helper.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 用指定元素替换当前集合中的元素
     * @param newContent
     * 可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象、或回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为元素的原始 HTML，`this` 指向当前元素
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
