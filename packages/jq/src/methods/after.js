import $ from '../$';
import './insertAfter';

/**
 * 插入到指定元素后面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
$.fn.after = function (selector) {
  $(selector).insertAfter(this);
  return this;
};
