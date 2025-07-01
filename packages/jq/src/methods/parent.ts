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
     * 获取当前集合中，所有元素的直接父元素的集合
     * @param selector CSS 选择器。若指定了该参数，则仅返回与该参数匹配的父元素的集合
     * @example
```js
// 返回 .box 元素的直接父元素的集合
$('.box').parent()
```
     * @example
```js
// 返回 .box 元素的直接父元素中含有 .parent 元素的集合
$('.box').parent('.parent')
```
     */
    parent(selector?: Selector): this;
  }
}

eachArray(['', 's', 'sUntil'], (name, nameIndex) => {
  $.fn[`parent${name}` as 'parent'] = function (
    this: JQ,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selector?: any,
    filter?: Selector,
  ): JQ {
    // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
    const $nodes = !nameIndex ? this : $(this.get().reverse());

    return dir($nodes, nameIndex, 'parentNode', selector, filter);
  };
});
