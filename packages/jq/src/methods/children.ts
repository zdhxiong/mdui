import JQElement from '../types/JQElement';
import Selector from '../types/Selector';
import { isElement, isWindow } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import unique from '../functions/unique';
import './each';
import './is';

declare module '../JQ' {
  interface JQ<T = JQElement> {
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
  const children: HTMLElement[] = [];

  this.each((_, element) => {
    if (isWindow(element)) {
      return;
    }

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
