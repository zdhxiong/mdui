import $ from '../$';
import './prepend';

/**
 * 前置到指定元素内部
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
$.fn.prependTo = function (selector) {
  $(selector).prepend(this);
  return this;
};
