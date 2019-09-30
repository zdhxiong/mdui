import $ from '../$';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import './each';
import './is';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 从 DOM 中移除选中的元素
     * @example ````移除 DOM 中所有 p 元素
```js
$('p').remove()
```
     * @example ````移除所有含 .box 的 p 元素
```js
$('p').remove('.box')
```
     */
    remove(selector?: Selector): this;
  }
}

$.fn.remove = function(this: JQ, selector?: Selector): JQ {
  return this.each((_, element) => {
    if (element.parentNode && (!selector || $(element).is(selector))) {
      element.parentNode.removeChild(element);
    }
  });
};
