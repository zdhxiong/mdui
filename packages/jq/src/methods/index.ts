import JQElement from '../types/JQElement';
import JQSelector from '../types/JQSelector';
import { isString } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './eq';
import './parent';
import './children';
import './get';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 如果没有传入参数，则返回当前对象中第一个元素相对于同辈元素的索引值。
     * 如果传入一个 CSS 选择器作为参数，则返回当前对象中第一个元素相对于 CSS 选择器匹配元素的索引值。
     * 如果传入一个 DOM 元素，则返回该 DOM 元素在当前对象中的索引值。
     * 如果传入一个 JQ 对象，则返回 JQ 对象中第一个元素在当前对象中的索引值。
     * @param selector
     */
    index(selector?: JQSelector): number;
  }
}

$.fn.index = function(this: JQ, selector?: JQSelector): number {
  if (!selector) {
    // 获取当前对象的第一个元素在同辈元素中的位置
    return this.eq(0)
      .parent()
      .children()
      .get()
      .indexOf(this[0]);
  }

  if (isString(selector)) {
    // 返回当前对象的第一个元素在指定选择器对应的元素中的位置
    return (
      $(selector)
        .eq(0)
        .parent()
        .children()
        .get()
        // @ts-ignore
        .indexOf(this[0])
    );
  }

  // 返回指定元素在当前 JQ 对象中的位置
  return this.get().indexOf($(selector).get(0));
};
