import $ from '../$';
import './each';

/**
 * 移除指定属性
 * @param attr {String}
 * @returns {JQ}
 */
$.fn.removeAttr = function (attr) {
  return this.each(function () {
    this.removeAttribute(attr);
  });
};
