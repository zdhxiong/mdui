import $ from '../$';
import './insertBefore';

/**
 * 插入到指定元素前面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
$.fn.before = function (selector) {
  $(selector).insertBefore(this);
  return this;
};
