import Selector from '../types/Selector';
import './parent';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前集合中，每个元素的所有父辈元素，直到遇到匹配元素为止（不包含匹配元素）。
     * @param selector
     * 可以是 CSS 选择器、DOM 元素、或 JQ 对象
     *
     * 表示遇到和该参数匹配的元素时，停止匹配
     *
     * 若没有指定该参数，则所有祖先元素都将被返回。即和 `.parents()` 效果一样
     * @param filter CSS 选择器。若指定了该参数，则仅返回和该参数匹配的元素
     * @example
```js
// 获取 .item 元素的所有祖先元素
$('.item').parentsUntil();
```
     * @example
```js
// 获取 .item 元素的所有祖先元素，直到遇到 .parent 元素为止
$('.item').parentsUntil('.parent');
```
     * @example
```js
// 获取 .item 元素的所有是 div 元素的祖先元素，直到遇到 .parent 元素为止
$('.item').parentsUntil('.parent', 'div');
```
     */
    parentsUntil(
      selector?: Selector | HTMLElement | JQ,
      filter?: Selector,
    ): this;
  }
}
