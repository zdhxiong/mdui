import $ from '../$';
import contains from '../functions/contains';
import { JQ } from '../JQ';
import Selector from '../types/Selector';
import { isString } from '../utils';
import './find';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 保留含有指定子元素的元素，去掉不含有指定子元素的元素
     * @param selector CSS 选择器或 DOM 元素
     * @example
```js
// 给含有 ul 的 li 加上背景色
$('li').has('ul').css('background-color', 'red');
```
     */
    has(selector: Selector | Element): this;
  }
}

$.fn.has = function (this: JQ, selector: Selector | Element): JQ {
  const $targets = isString(selector) ? this.find(selector) : $(selector);
  const { length } = $targets;

  return this.map(function () {
    for (let i = 0; i < length; i += 1) {
      if (contains(this, $targets[i])) {
        return this;
      }
    }

    return;
  });
};
