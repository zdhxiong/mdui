import $ from '../$';
import each from '../functions/each';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import './get';
import dir from './utils/dir';

declare module '../JQ' {
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

each(['', 's', 'sUntil'], (nameIndex, name) => {
  $.fn[`parent${name}`] = function (
    this: JQ,
    selector?: any,
    filter?: Selector,
  ): JQ {
    // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
    const $nodes = !nameIndex ? this : $(this.get().reverse());

    return dir($nodes, nameIndex, 'parentNode', selector, filter);
  };
});
