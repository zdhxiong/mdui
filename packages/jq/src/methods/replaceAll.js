import $ from '../$';
import './replaceWith';

/**
 * replaceAll - 替换掉指定元素
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
$.fn.replaceAll = function (selector) {
  $(selector).replaceWith(this);
  return this;
};
