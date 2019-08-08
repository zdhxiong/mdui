import $ from '../$';
import './each';

/**
 * 隐藏指定元素
 * @returns {JQ}
 */
$.fn.hide = function () {
  return this.each(function () {
    this.style.display = 'none';
  });
};
