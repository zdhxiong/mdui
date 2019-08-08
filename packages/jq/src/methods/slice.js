import JQ from '../JQ';
import $ from '../$';

/**
 * array 中提取的方法。从 start 开始，如果 end 指出。提取不包含 end 位置的元素。
 */
$.fn.slice = function (...args) {
  return new JQ([].slice.apply(this, args));
};
