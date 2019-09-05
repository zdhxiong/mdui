import JQElement from '../types/JQElement';
import Selector from '../types/Selector';
import { JQ } from '../JQ';
import $ from '../$';
import './add';
import './prevAll';
import './nextAll';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 取得同辈元素的集合。可指定 CSS 选择器作为参数
     * @param selector
     * @example ````获取 .box 元素的所有同辈元素
```js
$('.box').siblings()
```
     * @example ````获取 .box 元素的所有同辈元素中含 .selected 的元素
```js
$('.box').siblings('.selected')
```
     */
    siblings(selector?: Selector): this;
  }
}

/**
 * 取得同辈元素的集合
 * @param selector {String=}
 * @returns {JQ}
 */
$.fn.siblings = function(this: JQ, selector?: Selector): JQ {
  return this.prevAll(selector).add(this.nextAll(selector));
};
