import $ from '../$';
import './eq';

/**
 * 获取对象中第一个元素
 * @returns {JQ}
 */
$.fn.first = function () {
  return this.eq(0);
};
