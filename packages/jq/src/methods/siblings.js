import $ from '../$';
import './add';
import './prevAll';
import './nextAll';

/**
 * 取得同辈元素的集合
 * @param selector {String=}
 * @returns {JQ}
 */
$.fn.siblings = function (selector) {
  return this.prevAll(selector).add(this.nextAll(selector));
};
