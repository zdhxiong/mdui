import $ from '../$.js';
import merge from '../functions/merge.js';
import { JQ } from '../JQ.js';
import Selector from '../types/Selector.js';
import './each.js';
import './get.js';

declare module '../JQ.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 根据 CSS 选择器找到指定的后代节点的集合
     * @param selector CSS 选择器
     * @example
```js
$('#box').find('.box')
```
     */
    find(selector: Selector): this;
  }
}

$.fn.find = function (this: JQ, selector: Selector): JQ {
  const foundElements: HTMLElement[] = [];

  this.each((_, element) => {
    merge(foundElements, $(element.querySelectorAll(selector)).get());
  });

  return new JQ(foundElements);
};
