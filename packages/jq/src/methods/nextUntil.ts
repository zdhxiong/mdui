import Selector from '../types/Selector';
import './next';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前集合中，每个元素后面所有的同辈元素，直到遇到匹配元素为止（不包含匹配元素）。
     * @param selector
     * 可以是 CSS 选择器、DOM 元素、或 JQ 对象
     *
     * 表示遇到和该参数匹配的元素时，停止匹配
     *
     * 若没有指定该参数，则后面所有同辈元素都将被返回。即和 `.nextAll()` 效果一样
     * @param filter CSS 选择器。若指定了该参数，则仅返回和该参数匹配的元素
     * @example
```js
// 获取 .box 元素后面所有的同辈元素
$('.box').nextUntil();
```
     * @example
```js
// 获取 .box 元素后面的同辈元素，直到遇到 .until 元素为止
$('.box').nextUntil('.until')
```
     * @example
```js
// 获取 .box 元素后面同辈的 div 元素，直到遇到 .until 元素为止
$('.box').nextUntil('.until', 'div')
```
     */
    nextUntil(selector?: Selector | HTMLElement | JQ, filter?: Selector): this;
  }
}
