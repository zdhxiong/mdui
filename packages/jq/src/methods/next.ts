import $ from '../$.js';
import each from '../functions/each.js';
import { JQ } from '../JQ.js';
import Selector from '../types/Selector.js';
import dir from './utils/dir.js';

declare module '../JQ.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前集合中每个元素的后一个匹配的同辈元素
     * @param selector CSS 选择器。指定该参数时，将仅返回和该参数匹配的元素的集合
     * @example
```js
// 获取 .box 元素的后一个元素的集合
$('.box').next()
```
     * @example
```js
// 获取 .box 元素的后一个 div 元素的集合
$('.box').next('div')
```
     */
    next(selector?: Selector): this;
  }
}

each(['', 'All', 'Until'], (nameIndex, name) => {
  $.fn[`next${name}`] = function (
    this: JQ,
    selector?: any,
    filter?: Selector,
  ): JQ {
    return dir(this, nameIndex, 'nextElementSibling', selector, filter);
  };
});
