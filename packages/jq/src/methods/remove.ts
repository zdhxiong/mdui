import $ from '../$.js';
import { Selector, JQ } from '../shared/core.js';
import { removeChild } from '../shared/dom.js';
import './each.js';
import './is.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 从 DOM 中移除当前集合中的元素
     * @param selector CSS 选择器。若指定了该参数，则仅移除当前集合中和该参数匹配的元素
     * @example
```js
// 移除所有 p 元素
$('p').remove()
```
     * @example
```js
// 移除所有含 .box 的 p 元素
$('p').remove('.box')
```
     */
    remove(selector?: Selector): this;
  }
}

$.fn.remove = function (this: JQ, selector?: Selector): JQ {
  return this.each((_, element) => {
    if (element.parentNode && (!selector || $(element).is(selector))) {
      removeChild(element.parentNode, element);
    }
  });
};
