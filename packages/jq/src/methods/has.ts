import { $ } from '../$.js';
import { contains } from '../functions/contains.js';
import { isString } from '../shared/helper.js';
import './find.js';
import './map.js';
import type { JQ } from '../shared/core.js';
import type { Selector } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 在当前集合的所有元素中，筛选出含有指定子元素的元素。
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
