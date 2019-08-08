import $ from '../$';
import './each';

/**
 * 删除子节点
 * @returns {JQ}
 */
$.fn.empty = function () {
  return this.each(function () {
    this.innerHTML = '';
  });
};
