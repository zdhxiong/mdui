import $ from '../$';
import each from '../functions/each';
import unique from '../functions/unique';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import { isElement } from '../utils';
import './each';
import './is';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 获取当前元素的直接子元素，可以使用 CSS 选择器作为参数进行过滤
     * @param selector
     * @example ````找到 #box 的所有直接子元素
```js
$('#box').children()
```
     * @example ````找到 #box 的所有直接子元素中，包含 .box 的元素集合
```js
$('#box').children('.box')
```
     */
    children(selector?: Selector): this;
  }
}

$.fn.children = function(this: JQ, selector?: Selector): JQ {
  const children: Element[] = [];

  this.each((_, element) => {
    each(element.childNodes, (__, childNode) => {
      if (!isElement(childNode)) {
        return;
      }

      if (!selector || $(childNode).is(selector)) {
        children.push(childNode);
      }
    });
  });

  return new JQ(unique(children));
};
