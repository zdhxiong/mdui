import $ from '../$';
import './eq';

/**
 * 获取对象中最后一个元素
 * @returns {JQ}
 */
$.fn.last = function () {
  return this.eq(-1);
};
