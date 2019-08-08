import $ from '../$';
import './each';

/**
 * 删除属性值
 * @param name {String}
 * @returns {JQ}
 */
$.fn.removeProp = function (name) {
  return this.each(function () {
    try {
      delete this[name];
    } catch (e) {
      // empty
    }
  });
};
