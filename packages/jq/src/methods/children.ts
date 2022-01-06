import { Selector, isElement, eachArray } from '@mdui/shared/helpers.js';
import { $ } from '../$.js';
import { unique } from '../functions/unique.js';
import { JQ } from '../shared/core.js';
import './each.js';
import './is.js';

declare module '../shared/core.js' {
  interface JQ {
    /**
     * 获取当前元素的直接子元素
     * @param selector CSS 选择器。若指定了该参数，则使用该参数对子元素进行过滤
     * @example
```js
// 找到 #box 的所有直接子元素
$('#box').children()
```
     * @example
```js
// 找到 #box 的所有直接子元素中，包含 .box 的元素集合
$('#box').children('.box')
```
     */
    children(selector?: Selector): this;
  }
}

$.fn.children = function (this: JQ, selector?: Selector): JQ {
  const children: HTMLElement[] = [];

  this.each((_, element) => {
    eachArray(element.childNodes, (childNode) => {
      if (!isElement(childNode)) {
        return;
      }

      if (!selector || $(childNode).is(selector)) {
        children.push(childNode as HTMLElement);
      }
    });
  });

  return new JQ(unique(children));
};
