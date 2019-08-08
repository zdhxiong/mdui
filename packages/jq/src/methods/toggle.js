import $ from '../$';
import './each';

/**
 * 切换元素的显示状态
 * @returns {JQ}
 */
$.fn.toggle = function () {
  return this.each(function () {
    this.style.display = this.style.display === 'none' ? '' : 'none';
  });
};
