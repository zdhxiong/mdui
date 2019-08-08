import $ from '../$';
import each from '../functions/each';

/**
 * 遍历对象
 */
$.fn.each = function (callback) {
  return each(this, callback);
};
