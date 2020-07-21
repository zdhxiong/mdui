import HTMLString from '../types/HTMLString';
import Selector from '../types/Selector';
import TypeOrArray from '../types/TypeOrArray';
import './insertBefore';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 把当前集合中的元素插入到指定元素的后面，作为目标元素的兄弟元素
     *
     * 如果当前集合中的元素是页面中已有的元素，则将移动该元素，而不是复制
     *
     * 如果有多个目标元素，则将克隆当前集合中的元素，并添加到每个目标元素的后面
     * @param target 可以是 CSS 选择器、HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象
     * @returns 由新插入的元素组成的集合
     * @example
```js
$('<b>Hello</b>').insertAfter('<p>I would like to say: </p>');
// <p>I would like to say: </p><b>Hello</b>
```
     */
    insertAfter(
      target: Selector | HTMLString | TypeOrArray<Node> | JQ<Node>,
    ): this;
  }
}
