import { $ } from '../$.js';
import { eachArray } from '../shared/helper.js';
import './get.js';
import { dir } from './utils/dir.js';
import type { JQ } from '../shared/core.js';
import type { Selector } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前集合中每个元素的前一个匹配的同辈元素
     * @param selector CSS 选择器。指定该参数时，将仅返回和该参数匹配的元素的集合
     * @example
```js
// 获取 .box 元素的前一个元素的集合
$('.box').prev()
```
     * @example
```js
// 获取 .box 元素的前一个 div 元素的集合
$('.box').prev('div')
```
     */
    prev(selector?: Selector): this;
  }
}

eachArray(['', 'All', 'Until'], (name, nameIndex) => {
  $.fn[`prev${name}` as 'prev'] = function (
    this: JQ,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selector?: any,
    filter?: Selector,
  ): JQ {
    // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
    const $nodes = !nameIndex ? this : $(this.get().reverse());

    return dir($nodes, nameIndex, 'previousElementSibling', selector, filter);
  };
});
