import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import dir from './utils/dir';
import './get';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 如果没有传入参数，则返回直接父元素的 JQ 对象。
     * 如果传入了参数，仅返回和 CSS 选择器匹配的直接父元素的 JQ 对象。
     * @param selector
     * @example ````返回 .box 元素的直接父元素
```js
$('.box').parent()
```
     * @example ````返回 .box 元素的直接父元素中含有 .parent 类的元素
```js
$('.box').parent('.parent')
```
     */
    parent(selector?: JQSelector): this;
  }
}

each(['', 's', 'sUntil'], (nameIndex, name) => {
  $.fn[`parent${name}`] = function(this: JQ, selector?: JQSelector): JQ {
    // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
    const $nodes = nameIndex === 0 ? this : $(this.get().reverse());

    return dir($nodes, selector, nameIndex, 'parentNode');
  };
});
