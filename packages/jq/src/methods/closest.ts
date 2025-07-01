import { $ } from '../$.js';
import { JQ } from '../shared/core.js';
import './eq.js';
import './is.js';
import './parents.js';
import type { Selector } from '../shared/helper.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 从当前元素向上逐级匹配，返回最先匹配到的元素
     * @param selector CSS 选择器、DOM 元素、或 JQ 对象
     * @example
```js
// 获取 .box 元素的父元素中最近的 .parent 元素
$('.box').closest('.parent')
```
     */
    closest(selector: Selector | Element | JQ): this;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
$.fn.closest = function (this: JQ, selector: any): JQ {
  if (this.is(selector)) {
    return this;
  }

  const matched: HTMLElement[] = [];
  this.parents().each((_, element): void | false => {
    if ($(element).is(selector)) {
      matched.push(element);

      return false;
    }
  });

  return new JQ(matched);
};
