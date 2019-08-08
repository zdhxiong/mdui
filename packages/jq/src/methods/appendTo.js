import $ from '../$';
import './append';

/**
 * 追加到指定元素内容
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
$.fn.appendTo = function (selector) {
  $(selector).append(this);
  return this;
};
