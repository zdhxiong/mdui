import JQElement from '../types/JQElement';
import Selector from '../types/Selector';
import { isWindow } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import merge from '../functions/merge';
import './each';
import './get';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 根据 CSS 选择器找到指定的后代节点的集合
     * @param selector
     * @example
```js
$('#box').find('.box')
```
     */
    find(selector: Selector): this;
  }
}

$.fn.find = function(this: JQ, selector: Selector): JQ {
  const foundElements: HTMLElement[] = [];

  this.each((_, element) => {
    if (!isWindow(element)) {
      merge(foundElements, $(element.querySelectorAll(selector)).get());
    }
  });

  return new JQ(foundElements);
};
